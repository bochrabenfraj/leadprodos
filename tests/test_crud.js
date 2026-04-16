const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2UzMjJiZDI0MTkyN2MwNjBiNTQ0NyIsInN1YiI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBsZWFkcHJvZG9zLmNvbSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTc3NTEyMTIwMCwiZXhwIjoxNzc1NzI2MDAwLCJpYXQiOjE3NzUxMjEyMDAsImlzcyI6IkxlYWRQcm9kb3NBcGkiLCJhdWQiOiJMZWFkUHJvZG9zQXBwIn0.hMRXnP96QWwndxEreMA18e6lKFoyxhCPca2h3J8g5gk';

async function testCRUD() {
  // Test 1: Create a product
  console.log('\n✅ TEST 1: Creating a new product...');
  const newProduct = JSON.stringify({
    name: 'New Test Laptop',
    description: 'Test laptop created',
    price: 1500,
    stock: 5,
    category: 'Computers'
  });

  const createRes = await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(newProduct)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`   Status: ${res.statusCode}`);
        const result = JSON.parse(data);
        console.log(`   Created product ID: ${result.id}`);
        resolve(result);
      });
    });
    req.write(newProduct);
    req.end();
  });

  const productId = createRes.id;

  // Test 2: Update the product
  console.log('\n✅ TEST 2: Updating the product...');
  const updatedProduct = JSON.stringify({
    name: 'Updated Test Laptop',
    description: 'Updated description',
    price: 1800,
    stock: 3,
    category: 'Premium Computers'
  });

  await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updatedProduct)
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
    req.write(updatedProduct);
    req.end();
  });

  // Test 3: Delete the product
  console.log('\n✅ TEST 3: Deleting the product...');
  await new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productId}`,
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

  console.log('\n✅ All CRUD tests completed!');
}

testCRUD().catch(console.error);
