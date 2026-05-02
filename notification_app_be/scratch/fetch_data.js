const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const token = process.env.ACCESS_TOKEN;
const BASE_URL = 'http://20.207.122.201/evaluation-service';

async function fetchData() {
    try {
        console.log('--- Fetching Depots ---');
        const depotsRes = await axios.get(`${BASE_URL}/depots`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Depots:', JSON.stringify(depotsRes.data, null, 2));

        console.log('\n--- Fetching Vehicles ---');
        const vehiclesRes = await axios.get(`${BASE_URL}/vehicles`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Vehicles:', JSON.stringify(vehiclesRes.data, null, 2));

    } catch (err) {
        console.error('Fetch Failed:', err.response ? err.response.data : err.message);
    }
}

fetchData();
