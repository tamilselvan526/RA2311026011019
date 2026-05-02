const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

const authData = {
  email: "tp7053@srmist.edu.in",
  name: "tamilselvan p",
  rollNo: "ra2311026011019",
  accessCode: "QkbpxH",
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
};

async function authenticate() {
  console.log('🔄 Initiating secure authentication with the evaluation server...');
  try {
    const response = await axios.post('http://20.207.122.201/evaluation-service/auth', authData);
    const newToken = response.data.access_token;
    console.log('✅ Authentication Successful! Your fresh token is now saved to the .env file.');

    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/ACCESS_TOKEN=.*/, `ACCESS_TOKEN=${newToken}`);
    fs.writeFileSync(envPath, envContent);

  } catch (error) {
    console.error('❌ Authentication Failed. Please check your credentials in the script.');
    console.error('Error Details:', error.response ? error.response.data : error.message);
  }
}

authenticate();
