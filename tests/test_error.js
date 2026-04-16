const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2UzMjJiZDI0MTkyN2MwNjBiNTQ0NyIsInN1YiI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBsZWFkcHJvZG9zLmNvbSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTc3NTEyMTIwMCwiZXhwIjoxNzc1NzI2MDAwLCJpYXQiOjE3NzUxMjEyMDAsImlzcyI6IkxlYWRQcm9kb3NBcGkiLCJhdWQiOiJMZWFkUHJvZG9zQXBwIn0.hMRXnP96QWwndxEreMA18e6lKFoyxhCPca2h3J8g5gk';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/clients',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
