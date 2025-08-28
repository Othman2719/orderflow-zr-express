@echo off
echo Starting OrderFlow Backend Server...
echo.

cd server
echo Installing dependencies...
npm install

echo.
echo Starting backend server on port 3001...
npm run dev

pause
