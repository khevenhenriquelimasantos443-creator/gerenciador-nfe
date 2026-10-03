param([switch]$Agendado)   # -Agendado: chamado pelo Agendador (respeita o horario abaixo)

# =============================================================================
# enviar-notas.ps1 - manda para a planilha "Controle de entrada NF-e" uma COPIA
# de cada XML e PDF novo da pasta de notas da rede. Os arquivos da rede nao
# saem do lugar. Roda pelo Agendador de Tarefas a cada 15 minutos
# (instale com o instalar-agendamento.bat).
# =============================================================================

# ---- PREENCHA ESTAS 3 LINHAS (mantenha as aspas simples ' ') ----------------
$Pasta = '\\SERVIDOR\NOTAS'   # pasta das notas na rede (subpastas tambem sao lidas)
# XML e PDF em pastas separadas? Ponha as duas, separadas por virgula:
#   $Pasta = '\\SERVIDOR\NOTAS', '\\SERVIDOR\XML'
$Url   = 'COLE_AQUI_O_LINK'   # Apps Script: Implantar > Gerenciar implantacoes > URL do App da Web (inteira, termina em /exec)
$Token = 'COLE_AQUI_A_CHAVE'  # planilha: CONFIG > Chave do envio
# -----------------------------------------------------------------------------
# Este arquivo precisa se chamar enviar-notas.ps1

# Horario de funcionamento: fora dele o agendamento nao envia nada (rodando na mao, envia sempre)
$HoraInicio = 7    # 07:00
$HoraFim    = 20   # ate 20:00
if ($Agendado -and ((Get-Date).Hour -lt $HoraInicio -or (Get-Date).Hour -ge $HoraFim)) { exit 0 }

# Na primeira vez, envia so os arquivos dos ultimos 30 dias (mude se quiser mais)
$ApenasDesde = (Get-Date).AddDays(-30)

$Aqui   = Split-Path -Parent $MyInvocation.MyCommand.Path
$Lista  = Join-Path $Aqui 'enviados.txt'   # arquivos ja enviados (nao apague)
$Log    = Join-Path $Aqui 'envio-log.txt'  # o que aconteceu em cada envio
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Registrar($msg) {
  Add-Content -Path $Log -Value ((Get-Date -Format 'dd/MM/yyyy HH:mm:ss') + '  ' + $msg) -Encoding UTF8
}

# o log guarda so as ultimas 2000 linhas
if ((Test-Path -LiteralPath $Log) -and (Get-Item -LiteralPath $Log).Length -gt 300KB) {
  $resto = Get-Content -LiteralPath $Log -Encoding UTF8 | Select-Object -Last 2000
  Set-Content -LiteralPath $Log -Value $resto -Encoding UTF8
}

$Pastas = @($Pasta)
if ($Url -notmatch '^https://script\.google\.com/.+/exec$' -or $Token -match 'COLE_AQUI' -or ($Pastas -match 'SERVIDOR\\').Count -gt 0) {
  Registrar 'ERRO: preencha $Pasta, $Url e $Token no comeco do enviar-notas.ps1 (entre aspas simples).'
  exit 1
}

function Enviar($dados) {
  $corpo = [Text.Encoding]::UTF8.GetBytes(($dados | ConvertTo-Json -Compress -Depth 6))
  return Invoke-RestMethod -Uri $Url -Method Post -ContentType 'application/json; charset=utf-8' -Body $corpo -TimeoutSec 420
}

# So uma copia por vez: o agendamento de 15 min nao comeca outra enquanto esta ainda envia
$trava = New-Object System.Threading.Mutex($false, 'Global\EnviarNotasPlanilha')
if (-not $trava.WaitOne(0)) { exit 0 }

foreach ($p in $Pastas) { if (-not (Test-Path -LiteralPath $p)) { Registrar "ERRO: pasta nao encontrada: $p"; exit 1 } }

$enviados = @{}
if (Test-Path -LiteralPath $Lista) { Get-Content -LiteralPath $Lista -Encoding UTF8 | ForEach-Object { $enviados[$_] = $true } }

$agora = Get-Date
$arquivos = Get-ChildItem -LiteralPath $Pastas -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
  ($_.Extension -ieq '.xml' -or $_.Extension -ieq '.pdf') -and
  # arquivo copiado guarda a data antiga de alteracao: vale a mais nova entre criacao e alteracao
  (@($_.CreationTime, $_.LastWriteTime) | Measure-Object -Maximum).Maximum -ge $ApenasDesde -and
  $_.LastWriteTime -lt $agora.AddMinutes(-1)   # ainda sendo gravado: fica para a proxima
} | Sort-Object @{ Expression = { if ($_.Extension -ieq '.xml') { 0 } else { 1 } } }, Name   # XML primeiro: e ele que cria a nota

$faltam = @($arquivos | Where-Object { -not $enviados.ContainsKey($_.FullName + '|' + $_.Length + '|' + $_.LastWriteTime.Ticks) }).Count
if ($faltam -gt 0) { Registrar "Comecou: $faltam arquivo(s) novo(s) para enviar." }

$novos = 0; $erros = 0; $ultimoResumo = ''
$lote = New-Object System.Collections.ArrayList; $tamanhoLote = 0

# Manda o lote (ate 10 arquivos ou ~4 MB) num pedido so; a planilha guarda e ja cria as notas
function EnviarLote {
  if ($lote.Count -eq 0) { return }
  try {
    $r = Enviar @{ token = $Token; acao = 'arquivos'; arquivos = @($lote | ForEach-Object { $_.dados }) }
  } catch {
    $codigo = 0
    if ($_.Exception.Response) { $codigo = [int]$_.Exception.Response.StatusCode }
    if ($codigo -eq 404 -or $codigo -eq 401 -or $codigo -eq 403) {
      Registrar "ERRO $codigo no link do app da Web: o `$Url esta errado ou a implantacao nao existe. No Apps Script: Implantar > Gerenciar implantacoes > App da Web > copie a URL inteira (termina em /exec) e cole no `$Url."
      exit 1
    }
    foreach ($item in $lote) { $script:erros++; Registrar "ERRO em $($item.caminho): $($_.Exception.Message)" }
    $lote.Clear(); $script:tamanhoLote = 0
    return
  }
  if ($null -eq $r -or -not ($r.PSObject.Properties.Name -contains 'ok')) {
    Registrar 'ERRO: a planilha respondeu com uma pagina de login. No Apps Script: Implantar > Gerenciar implantacoes > Editar > Quem pode acessar: Qualquer pessoa.'
    exit 1
  }
  if (-not $r.ok) {
    foreach ($item in $lote) { $script:erros++; Registrar "ERRO em $($item.caminho): $($r.erro)" }
  } else {
    for ($i = 0; $i -lt $lote.Count; $i++) {
      $res = $r.resultados[$i]; $item = $lote[$i]
      if ($res.ok) {
        Add-Content -LiteralPath $Lista -Value $item.id -Encoding UTF8
        $enviados[$item.id] = $true
        if ($res.situacao -eq 'salvo') { $script:novos++ }
      } else { $script:erros++; Registrar "ERRO em $($item.caminho): $($res.erro)" }
    }
    if ($r.resumo) { $script:ultimoResumo = $r.resumo }
    if ($script:novos -gt 0 -and $script:novos % 50 -lt $lote.Count) { Registrar "$($script:novos) arquivo(s) enviado(s) ate agora. Planilha: $($r.resumo)" }
  }
  $lote.Clear(); $script:tamanhoLote = 0
}

foreach ($a in $arquivos) {
  $id = $a.FullName + '|' + $a.Length + '|' + $a.LastWriteTime.Ticks
  if ($enviados.ContainsKey($id)) { continue }
  try { $conteudo = [Convert]::ToBase64String([IO.File]::ReadAllBytes($a.FullName)) }
  catch { $erros++; Registrar "ERRO ao ler $($a.FullName): $($_.Exception.Message)"; continue }
  if ($lote.Count -gt 0 -and ($lote.Count -ge 10 -or $tamanhoLote + $conteudo.Length -gt 4MB)) { EnviarLote }
  [void]$lote.Add(@{ id = $id; caminho = $a.FullName; dados = @{ nome = $a.Name; caminho = $a.FullName; conteudo = $conteudo } })
  $tamanhoLote += $conteudo.Length
}
EnviarLote

if ($novos -gt 0) { Registrar "Terminou: $novos arquivo(s) enviado(s). Planilha: $ultimoResumo" }
if ($erros -gt 0) { Registrar "$erros arquivo(s) com erro: tenta de novo na proxima vez." }
if ($novos -eq 0 -and $erros -eq 0) { Registrar "Rodou: nenhum arquivo novo em $($Pastas -join ' e ')." }
