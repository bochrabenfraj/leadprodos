# Decode JWT Token
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

Write-Host "Token Parts:" -ForegroundColor Green
$parts = $token -split '\.'
Write-Host "Header: $($parts[0])"
Write-Host "Payload: $($parts[1])"
Write-Host "Signature: $($parts[2].Substring(0,20))..."

# Decode Payload
Write-Host ""
Write-Host "Decoding Payload:" -ForegroundColor Green
$payload = $parts[1]

# Add padding if needed
while ($payload.Length % 4) {
    $payload += "="
}

$decodedBytes = [Convert]::FromBase64String($payload)
$decodedString = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
$decodedPayload = $decodedString | ConvertFrom-Json

Write-Host ($decodedPayload | ConvertTo-Json -Depth 10)
