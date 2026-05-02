const axios = require('axios');

async function testAPIs() {
    console.log('--- Testing Add Vehicle API ---');
    try {
        const start = Date.now();
        const res = await axios.post('http://localhost:3000/api/vehicles', { vehicleId: 'V123' });
        const end = Date.now();
        console.log('Request Body: { vehicleId: "V123" }');
        console.log('Response:', res.data);
        console.log('Response Time:', end - start, 'ms');
    } catch (err) {
        console.log('Error:', err.response ? err.response.data : err.message);
    }

    console.log('\n--- Testing Schedule Maintenance (Near Date) ---');
    try {
        const nearDate = new Date();
        nearDate.setDate(nearDate.getDate() + 2); // 2 days from now
        const start = Date.now();
        const res = await axios.post('http://localhost:3000/api/maintenance/schedule', { date: nearDate.toISOString() });
        const end = Date.now();
        console.log('Request Body:', { date: nearDate.toISOString() });
        console.log('Response:', res.data);
        console.log('Response Time:', end - start, 'ms');
    } catch (err) {
        console.log('Error:', err.response ? err.response.data : err.message);
    }

    console.log('\n--- Testing Schedule Maintenance (Far Date) ---');
    try {
        const farDate = new Date();
        farDate.setDate(farDate.getDate() + 15); // 15 days from now
        const start = Date.now();
        const res = await axios.post('http://localhost:3000/api/maintenance/schedule', { date: farDate.toISOString() });
        const end = Date.now();
        console.log('Request Body:', { date: farDate.toISOString() });
        console.log('Response:', res.data);
        console.log('Response Time:', end - start, 'ms');
    } catch (err) {
        console.log('Error:', err.response ? err.response.data : err.message);
    }
}

testAPIs();
