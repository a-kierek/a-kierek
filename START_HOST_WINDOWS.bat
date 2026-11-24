@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Najpierw zainstaluj Node.js z https://nodejs.org/
 pause
 exit /b 1
)
start "THE CATROOMS HOST SERVER" cmd /k node "server\server.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8765"
echo Serwer uruchomiony w nowym oknie. Nie zamykaj tego okna podczas gry.
pause
