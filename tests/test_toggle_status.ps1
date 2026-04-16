# Test Toggle User Status
Write-Host "1. Getting token..." -ForegroundColor Green

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

Write-Host "✅ Token obtained"
Write-Host ""

# Get users first
Write-Host "2. Getting users..." -ForegroundColor Green

$usersResp = Invoke-WebRequest -Uri 'http://localhost:5000/api/users' `
    -Method GET `
    -Headers @{'Authorization' = "Bearer $token"} `
    -UseBasicParsing

$users = $usersResp.Content | ConvertFrom-Json
$userToToggle = $users | Where-Object { $_.username -eq "john.doe" } | Select-Object -First 1

Write-Host "User found: $($userToToggle.username)"
Write-Host "Current status: $(if($userToToggle.isActive) {'Actif'} else {'Inactif'})"
Write-Host ""

Write-Host "3. Toggling status..." -ForegroundColor Green

$toggleResp = Invoke-WebRequest -Uri "http://localhost:5000/api/users/$($userToToggle.id)/toggle-status" `
    -Method PUT `
    -Headers @{'Authorization' = "Bearer $token"} `
    -UseBasicParsing

$toggleData = $toggleResp.Content | ConvertFrom-Json

Write-Host "✅ Toggle successful!"
Write-Host "Response: $($toggleData | ConvertTo-Json)"
Write-Host ""

Write-Host "4. Verifying new status..." -ForegroundColor Green

$usersResp2 = Invoke-WebRequest -Uri 'http://localhost:5000/api/users' `
    -Method GET `
    -Headers @{'Authorization' = "Bearer $token"} `
    -UseBasicParsing

$users2 = $usersResp2.Content | ConvertFrom-Json
$updatedUser = $users2 | Where-Object { $_.username -eq "john.doe" } | Select-Object -First 1

Write-Host "New status: $(if($updatedUser.isActive) {'✅ Actif'} else {'❌ Inactif'})"
Write-Host ""

Write-Host "5. Toggling again to restore..." -ForegroundColor Green

$toggleResp2 = Invoke-WebRequest -Uri "http://localhost:5000/api/users/$($userToToggle.id)/toggle-status" `
    -Method PUT `
    -Headers @{'Authorization' = "Bearer $token"} `
    -UseBasicParsing

$toggleData2 = $toggleResp2.Content | ConvertFrom-Json
Write-Host "✅ Toggled back to: $(if($toggleData2.isActive) {'Actif'} else {'Inactif'})"
