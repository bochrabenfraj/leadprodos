# Test Users API
Write-Host "1. Testing Login..." -ForegroundColor Green
$loginBody = @{
    email = "admin@leadprodos.com"
    password = "Admin@123"
} | ConvertTo-Json

$loginResp = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' `
    -Method POST `
    -ContentType 'application/json' `
    -Body $loginBody `
    -UseBasicParsing

$loginData = $loginResp.Content | ConvertFrom-Json
$token = $loginData.token

Write-Host "✅ Login Success"
Write-Host "Token: $($token.Substring(0, 50))..."
Write-Host ""

Write-Host "2. Testing GET /api/users..." -ForegroundColor Green
try {
    $usersResp = Invoke-WebRequest -Uri 'http://localhost:5000/api/users' `
        -Method GET `
        -Headers @{'Authorization' = "Bearer $token"} `
        -UseBasicParsing

    Write-Host "✅ Status: $($usersResp.StatusCode)"
    Write-Host "Users Count: $($usersResp.Content | ConvertFrom-Json | Measure-Object | Select-Object -ExpandProperty Count)"
    
    $users = $usersResp.Content | ConvertFrom-Json
    $users | ForEach-Object {
        Write-Host "   - $($_.username) ($($_.email)) - Role: $($_.role) - Active: $($_.isActive)"
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.StatusCode)"
}
