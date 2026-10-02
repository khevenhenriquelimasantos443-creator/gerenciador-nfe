# =============================================================================
# enviar-notas.ps1 - manda para a planilha "Controle de entrada NF-e" uma COPIA
# de cada XML e PDF novo da pasta de notas da rede. Os arquivos da rede nao
# saem do lugar. Roda pelo Agendador de Tarefas a cada 15 minutos
# (instale com o instalar-agendamento.bat).
# =============================================================================

# ---- PREENCHA ESTAS 3 LINHAS ------------------------------------------------
$Pasta = '\\SERVIDOR\NOTAS'   # pasta das notas na rede (subpastas tambem sao lidas)
$Url   = 'COLE_AQUI_O_LINK'   # planilha: NF-e > Ver link e chave para o script do PC
$Token = 'COLE_AQUI_A_CHAVE'  # idem
# -----------------------------------------------------------------------------

# Na primeira vez, envia so os arquivos dos ultimos 30 dias (mude se quiser mais)
$ApenasDesde = (Get-Date).AddDays(-30)

$Aqui   = Split-Path -Parent $MyInvocation.MyCommand.Path
$Lista  = Join-Path $Aqui 'enviados.txt'   # arquivos ja enviados (nao apague)
$Log    = Join-Path $Aqui 'envio-log.txt'  # o que aconteceu em cada envio
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Registrar($msg) {
  Add-Content -Path $Log -Value ((Get-Date -Format 'dd/MM/yyyy HH:mm:ss') + '  ' + $msg) -Encoding UTF8
}

function Enviar($dados) {
  $corpo = [Text.Encoding]::UTF8.GetBytes(($dados | ConvertTo-Json -Compress))
  return Invoke-RestMethod -Uri $Url -Method Post -ContentType 'application/json; charset=utf-8' -Body $corpo -TimeoutSec 300
}

if (-not (Test-Path -LiteralPath $Pasta)) { Registrar "ERRO: pasta nao encontrada: $Pasta"; exit 1 }

$enviados = @{}
if (Test-Path -LiteralPath $Lista) { Get-Content -LiteralPath $Lista -Encoding UTF8 | ForEach-Object { $enviados[$_] = $true } }

$agora = Get-Date
$arquivos = Get-ChildItem -LiteralPath $Pasta -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
  ($_.Extension -ieq '.xml' -or $_.Extension -ieq '.pdf') -and
  # arquivo copiado guarda a data antiga de alteracao: vale a mais nova entre criacao e alteracao
  (@($_.CreationTime, $_.LastWriteTime) | Measure-Object -Maximum).Maximum -ge $ApenasDesde -and
  $_.LastWriteTime -lt $agora.AddMinutes(-1)   # ainda sendo gravado: fica para a proxima
}

$novos = 0; $erros = 0
foreach ($a in $arquivos) {
  $id = $a.FullName + '|' + $a.Length + '|' + $a.LastWriteTime.Ticks
  if ($enviados.ContainsKey($id)) { continue }
  try {
    $r = Enviar @{ token = $Token; acao = 'arquivo'; nome = $a.Name; caminho = $a.FullName
                   conteudo = [Convert]::ToBase64String([IO.File]::ReadAllBytes($a.FullName)) }
    if ($r.ok) {
      Add-Content -LiteralPath $Lista -Value $id -Encoding UTF8
      $enviados[$id] = $true
      if ($r.situacao -eq 'salvo') { $novos++ }
    } else { $erros++; Registrar "ERRO em $($a.FullName): $($r.erro)" }
  } catch { $erros++; Registrar "ERRO em $($a.FullName): $($_.Exception.Message)" }
}

if ($novos -gt 0) {
  try { $r = Enviar @{ token = $Token; acao = 'processar' }; Registrar "$novos arquivo(s) enviado(s). $($r.resumo)" }
  catch { Registrar "Enviados $novos arquivo(s), mas a planilha nao respondeu: $($_.Exception.Message)" }
}
if ($erros -gt 0) { Registrar "$erros arquivo(s) com erro: tenta de novo na proxima vez." }
