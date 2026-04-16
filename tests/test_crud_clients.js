const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2UzMjJiZDI0MTkyN2MwNjBiNTQ0NyIsInN1YiI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBsZWFkcHJvZG9zLmNvbSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTc3NTEyMTIwMCwiZXhwIjoxNzc1NzI2MDAwLCJpYXQiOjE3NzUxMjEyMDAsImlzcyI6IkxlYWRQcm9kb3NBcGkiLCJhdWQiOiJMZWFkUHJvZG9zQXBwIn0.hMRXnP96QWwndxEreMA18e6lKFoyxhCPca2h3J8g5gk';

async function testClientsCRUD() {
  // Test 1: Create a client
  console.log('\n✅ TEST 1: Creating a new client...');
  const newClient = JSON.stringify({
    name: 'New Test Client',
    email: 'test@example.com',
    phone: '+1 123 456 7890',
    company: 'Test Company Inc',
    socialMediaProfiles: 'LinkedIn: test | Twitter: @test',
    interestScore: 75
  });

  const createRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/clients',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(newClient)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        const result = JSON.parse(data);
        console.log(`   Created client ID: ${result.id}`);
        resolve(result);
      });
    });
    req.write(newClient);
    req.end();
  });

  const clientId = createRes.id;

  // Test 2: Update the client
  console.log('\n✅ TEST 2: Updating the client...');
  const updatedClient = JSON.stringify({
    name: 'Updated Test Client',
    email: 'updated@example.com',
    phone: '+1 987 654 3210',
    company: 'Updated Company Corp',
    socialMediaProfiles: 'LinkedIn: updated | Twitter: @updated',
    interestScore: 85
  });

  await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/clients/${clientId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updatedClient)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data}`);
        resolve();
      });
    });
    req.write(updatedClient);
    req.end();
  });

  // Test 3: Delete the client
  console.log('\n✅ TEST 3: Deleting the client...');
  await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/clients/${clientId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Response: ${data}`);
        resolve();
      });
    });
    req.end();
  });

  console.log('\n✅ All Clients CRUD tests completed!');
}

testClientsCRUD().catch(console.error);
