@echo off
title Family Organizer
echo ========================================
echo    Family Organizer - Starting...
echo ========================================
echo.

:: Set the working directory
cd /d "%~dp0"

:: Check if node_modules exist for backend
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

:: Check if node_modules exist for web
if not exist "web\node_modules" (
    echo Installing web dependencies...
    cd web
    call npm install
    cd ..
)

:: Start backend server in background
echo Starting backend server...
start "Family Organizer - Backend" /min cmd /c "cd backend && npx ts-node src/server.ts"

:: Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

:: Start web frontend and open browser
echo Starting web application...
start "Family Organizer - Web" /min cmd /c "cd web && npx vite --open"

echo.
echo ========================================
echo    Family Organizer is running!
echo ========================================
echo.
echo    Web App: http://localhost:5173
echo    Backend: http://localhost:3000
echo.
echo    Close this window to keep running
echo    or press any key to stop all servers
echo ========================================
pause > nul

:: Kill the servers when user presses a key
taskkill /FI "WINDOWTITLE eq Family Organizer - Backend*" /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Family Organizer - Web*" /F > nul 2>&1
echo Servers stopped.