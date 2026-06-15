@echo off
cd /d "%~dp0"

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

echo.
echo Starting local HTTPS server (default port 8443)...
echo Set PORT=XXXX before running to use a different port.
echo Update your Power-Up iframe URL in Trello admin to match the logged URL.
echo Press Ctrl+C to stop.
echo.

cd server
node server.js

if errorlevel 1 (
  echo.
  echo Server failed to start. Check the error above for port conflicts or permissions.
)

pause
