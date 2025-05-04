# Uruchom frontend (npm start w nowym oknie PowerShell)
Start-Process powershell -NoNewWindow -ArgumentList '-NoExit', '-Command', 'cd frontend; npm start'

# Uruchom backend (uvicorn w nowym oknie PowerShell)
Start-Process powershell -NoNewWindow -ArgumentList '-NoExit', '-Command', 'cd source; uvicorn main:app --reload'
