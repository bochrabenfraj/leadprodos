const axios = require('axios');

async function testAPI() {
  try {
    console.log('\n====== API TEST ======\n');
    
    // Test without auth to see if it's an auth issue
    console.log('Testing /api/products without auth...');
    try {
      const res = await axios.get('http://localhost:5000/api/products', { timeout: 5000 });
      console.log(`✅ Response: ${res.status} - ${res.data.length || Object.keys(res.data).length} items`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        console.log('First product:', JSON.stringify(res.data[0]).substring(0, 200));
      }
    } catch (e) {
      console.log(`❌ Error: ${e.response?.status || e.code} - ${e.response?.data || e.message}`);
    }
    
    // Test clients endpoint
    console.log('\nTesting /api/clients without auth...');
    try {
      const res = await axios.get('http://localhost:5000/api/clients', { timeout: 5000 });
      console.log(`✅ Response: ${res.status} - ${res.data.length || Object.keys(res.data).length} items`);
      if (Array.isArray(res.data) && res.data.length > 0) {
        console.log('First client:', JSON.stringify(res.data[0]).substring(0, 200));
      }
    } catch (e) {
      console.log(`❌ Error: ${e.response?.status || e.code} - ${e.response?.data || e.message}`);
    }
    
    console.log('\n====== END API TEST ======\n');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAPI();
