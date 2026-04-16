# Create test users
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

Write-Host "1. Creating test user 1..." -ForegroundColor Green

$user1Body = @{
    username = "john.doe"
    email = "john.doe@example.com"
    password = "Password@123"
    role = "User"
} | ConvertTo-Json

$user1Resp = Invoke-WebRequest -Uri 'http://localhost:5000/api/users' `
    -Method POST `
    -ContentType 'application/json' `
    -Headers @{'Authorization' = "Bearer $token"} `
    -Body $user1Body `
    -UseBasicParsing

$user1Data = $user1Resp.Content | ConvertFrom-Json
Write-Host "✅ User 1 created: $($user1Data.id)"

Write-Host ""
Write-Host "2. Creating test user 2 (Admin)..." -ForegroundColor Green

$user2Body = @{
    username = "jane.smith"
    email = "jane.smith@example.com"
    password = "SecurePass@456"
    role = "Admin"
} | ConvertTo-Json

$user2Resp = Invoke-WebRequest -Uri 'http://localhost:5000/api/users' `
    -Method POST `
    -ContentType 'application/json' `
    -Headers @{'Authorization' = "Bearer $token"} `
    -Body $user2Body `
    -UseBasicParsing

$user2Data = $user2Resp.Content | ConvertFrom-Json
Write-Host "✅ User 2 created: $($user2Data.id)"

Write-Host ""
Write-Host "3. Listing all users..." -ForegroundColor Green

$usersResp = Invoke-WebRequest -Uri 'http://localhost:5000/api/users' `
    -Method GET `
    -Headers @{'Authorization' = "Bearer $token"} `
    -UseBasicParsing

$users = $usersResp.Content | ConvertFrom-Json
Write-Host "Total users: $($users.Count)"
$users | ForEach-Object {
    Write-Host "   - $($_.username) ($($_.email)) - Role: $($_.role) - Active: $($_.isActive)"
}
