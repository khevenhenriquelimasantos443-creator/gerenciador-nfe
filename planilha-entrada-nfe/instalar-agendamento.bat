@echo off
rem Agenda o enviar-notas.ps1 para rodar a cada 15 minutos (no usuario atual, que enxerga a pasta da rede).
rem Fora do horario de funcionamento (no comeco do enviar-notas.ps1) o agendamento nao envia nada.
rem Deixe este arquivo na mesma pasta do enviar-notas.ps1 (de preferencia uma pasta do PC, ex.: C:\EnvioNFe)
rem e de dois cliques.
set SCRIPT=%~dp0enviar-notas.ps1
if not exist "%SCRIPT%" (
  echo.
  echo NAO ACHEI o arquivo:
  echo    %SCRIPT%
  echo.
  echo Arquivos .ps1 que estao nesta pasta:
  dir /b "%~dp0*.ps1*" 2>nul
  echo.
  echo O enviar-notas.ps1 precisa estar NESTA pasta e com esse nome exato.
  echo Dica: no Explorador de Arquivos, ative Exibir ^> Extensoes de nomes de arquivos para ver o nome inteiro
  echo ^(ex.: "enviar-notas.ps1.txt" ou "enviar-notas ^(1^).ps1" precisam ser renomeados^).
  echo.
  pause
  exit /b 1
)
schtasks /Create /F /SC MINUTE /MO 15 /TN "Enviar NF-e para a planilha" /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%SCRIPT%\" -Agendado"
if errorlevel 1 (
  echo.
  echo Nao consegui criar o agendamento. Tente de novo clicando com o botao direito ^> Executar como administrador.
) else (
  echo.
  echo Pronto: o envio roda a cada 15 minutos, das 07h as 20h. Rodando a primeira vez agora...
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%"
  echo Veja o resultado em envio-log.txt ^(na mesma pasta^) e na planilha.
)
pause
