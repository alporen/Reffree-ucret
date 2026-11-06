@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 26 veya daha yenisi kurulu olmali.
  echo https://nodejs.org adresinden kurup tekrar deneyin.
  pause
  exit /b 1
)
set "HAKEM_DATA_DIR=%~dp0data"
set "HOST=127.0.0.1"
node server.js
pause
