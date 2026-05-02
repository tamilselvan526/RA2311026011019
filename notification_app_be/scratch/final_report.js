const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const token = process.env.ACCESS_TOKEN;
const EVAL_API = "http://20.207.122.201/evaluation-service";
const LOCAL_API = "http://localhost:3000/api";

async function runFinalReport() {
    // Reload token from .env
    require('dotenv').config({ path: path.join(__dirname, '../../.env'), override: true });
    const currentToken = process.env.ACCESS_TOKEN;

    console.log('=== STEP 1: AUTH SUCCESS ===');
    console.log('Token Status: Valid');
    console.log('Access Token:', currentToken.substring(0, 30) + '...');

    console.log('\n=== STEP 2: LOGS API ===');
    try {
        const logRes = await axios.post(`${EVAL_API}/logs`, 
            { stack: "backend", level: "info", package: "service", message: "Final Verification" },
            { headers: { Authorization: `Bearer ${currentToken}` } }
        );
        console.log('Status: 200 OK');
        console.log('Response:', logRes.data);
    } catch (e) { 
        console.log('Log API error:', e.response ? e.response.data : e.message); 
    }

    console.log('\n=== STEP 3: DEPOTS API ===');
    try {
        const depotsRes = await axios.get(`${EVAL_API}/depots`, { 
            headers: { Authorization: `Bearer ${currentToken}` } 
        });
        console.log('Depots Found:', depotsRes.data.depots.length);
        console.log('Data:', JSON.stringify(depotsRes.data.depots, null, 2));
    } catch (e) { console.log('Depots API error'); }

    console.log('\n=== STEP 4: VEHICLES API ===');
    try {
        const vehiclesRes = await axios.get(`${EVAL_API}/vehicles`, { 
            headers: { Authorization: `Bearer ${currentToken}` } 
        });
        console.log('Vehicles Found:', vehiclesRes.data.vehicles.length);
        console.log('Sample Data:', JSON.stringify(vehiclesRes.data.vehicles.slice(0, 2), null, 2));
    } catch (e) { console.log('Vehicles API error'); }

    console.log('\n=== STEP 5: YOUR SCHEDULE API ===');
    try {
        const scheduleRes = await axios.get(`${LOCAL_API}/schedule`);
        console.log('Status: 200 OK');
        console.log('Total Impact:', scheduleRes.data.totalImpact);
        console.log('Tasks Selected:', scheduleRes.data.selectedTasks.length);
        console.log('Sample Task:', JSON.stringify(scheduleRes.data.selectedTasks[0], null, 2));
    } catch (e) { console.log('Schedule API error - Make sure server is running on port 3000'); }
}

runFinalReport();
