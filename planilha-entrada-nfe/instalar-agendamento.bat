@echo off
rem Agenda o enviar-notas.ps1 para rodar a cada 15 minutos (no usuario atual, que enxerga a pasta da rede).
rem Deixe este arquivo na mesma pasta do enviar-notas.ps1 e de dois cliques.
set SCRIPT=%~dp0enviar-notas.ps1
schtasks /Create /F /SC MINUTE /MO 15 /TN "Enviar NF-e para a planilha" /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%SCRIPT%\""
if errorlevel 1 (
  echo.
  echo Nao consegui criar o agendamento. Tente de novo clicando com o botao direito ^> Executar como administrador.
) else (
  echo.
  echo Pronto: o envio roda a cada 15 minutos. Rodando a primeira vez agora...
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
  echo Veja o resultado em envio-log.txt e na planilha.
)
pause
