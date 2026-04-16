const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2UzMjJiZDI0MTkyN2MwNjBiNTQ0NyIsInN1YiI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBsZWFkcHJvZG9zLmNvbSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTc3NTEyMTIwMCwiZXhwIjoxNzc1NzI2MDAwLCJpYXQiOjE3NzUxMjEyMDAsImlzcyI6IkxlYWRQcm9kb3NBcGkiLCJhdWQiOiJMZWFkUHJvZG9zQXBwIn0.hMRXnP96QWwndxEreMA18e6lKFoyxhCPca2h3J8g5gk';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/products/by-category',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const result = JSON.parse(data);
    console.log('\n📊 Products Grouped by Category:\n');
    
    result.forEach(group => {
      console.log(`\n📦 ${group.category} (${group.count} products)`);
      console.log('   ' + '─'.repeat(50));
      group.products.forEach(p => {
        console.log(`   • ${p.name} - $${p.price} (Stock: ${p.stock})`);
      });
    });
    
    console.log('\n✅ Total categories:', result.length);
    console.log('✅ Total products:', result.reduce((sum, g) => sum + g.count, 0));
  });
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.end();
