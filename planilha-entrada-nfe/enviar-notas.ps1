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
  $corpo = [Text.Encoding]::UTF8.GetBytes(($dados | ConvertTo-Json -Compress))
  return Invoke-RestMethod -Uri $Url -Method Post -ContentType 'application/json; charset=utf-8' -Body $corpo -TimeoutSec 420
}

# Pede para a planilha criar as notas com os XMLs que ja chegaram e ligar os PDFs
function Processar($quantos) {
  try { $r = Enviar @{ token = $Token; acao = 'processar' }; Registrar "$quantos arquivo(s) enviado(s) ate agora. Planilha: $($r.resumo)" }
  catch { Registrar "Enviados $quantos arquivo(s), mas a planilha nao respondeu ao criar as notas: $($_.Exception.Message) (tenta de novo no fim)" }
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

$novos = 0; $erros = 0
foreach ($a in $arquivos) {
  $id = $a.FullName + '|' + $a.Length + '|' + $a.LastWriteTime.Ticks
  if ($enviados.ContainsKey($id)) { continue }
  try {
    $r = Enviar @{ token = $Token; acao = 'arquivo'; nome = $a.Name; caminho = $a.FullName
                   conteudo = [Convert]::ToBase64String([IO.File]::ReadAllBytes($a.FullName)) }
    if ($null -eq $r -or -not ($r.PSObject.Properties.Name -contains 'ok')) {
      # resposta em HTML (tela de login do Google): o app da Web nao esta liberado para "Qualquer pessoa"
      Registrar 'ERRO: a planilha respondeu com uma pagina de login. No Apps Script: Implantar > Gerenciar implantacoes > Editar > Quem pode acessar: Qualquer pessoa.'
      exit 1
    }
    if ($r.ok) {
      Add-Content -LiteralPath $Lista -Value $id -Encoding UTF8
      $enviados[$id] = $true
      if ($r.situacao -eq 'salvo') {
        $novos++
        if ($novos % 20 -eq 0) { Processar $novos }   # as notas vao aparecendo durante o envio
      }
    } else { $erros++; Registrar "ERRO em $($a.FullName): $($r.erro)" }
  } catch {
    $codigo = 0
    if ($_.Exception.Response) { $codigo = [int]$_.Exception.Response.StatusCode }
    if ($codigo -eq 404 -or $codigo -eq 401 -or $codigo -eq 403) {
      # o link esta errado: nao adianta tentar os outros arquivos
      Registrar "ERRO $codigo no link do app da Web: o `$Url esta errado ou a implantacao nao existe. No Apps Script: Implantar > Gerenciar implantacoes > App da Web > copie a URL inteira (termina em /exec) e cole no `$Url."
      exit 1
    }
    $erros++; Registrar "ERRO em $($a.FullName): $($_.Exception.Message)"
  }
}

if ($novos -gt 0) {
  try { $r = Enviar @{ token = $Token; acao = 'processar' }; Registrar "Terminou: $novos arquivo(s) enviado(s). Planilha: $($r.resumo)" }
  catch { Registrar "Terminou: $novos arquivo(s) enviado(s), mas a planilha nao respondeu ao criar as notas: $($_.Exception.Message)" }
}
if ($erros -gt 0) { Registrar "$erros arquivo(s) com erro: tenta de novo na proxima vez." }
if ($novos -eq 0 -and $erros -eq 0) { Registrar "Rodou: nenhum arquivo novo em $($Pastas -join ' e ')." }
