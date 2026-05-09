Write-Host "Starting LinkCraft AI..."
Write-Host "Make sure you have set your GEMINI_API_KEY in backend/.env"

# Start Backend
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn main:app --reload --port 8000" -WorkingDirectory ".\backend"

# Start Frontend
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory ".\frontend"

Write-Host "Servers started. Backend on http://localhost:8000, Frontend on http://localhost:5173"
