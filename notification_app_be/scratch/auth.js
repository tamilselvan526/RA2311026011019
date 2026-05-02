const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const authData = {
  email: "tp7053@srmist.edu.in",
  name: "Tamilselvan P",
  rollNo: "RA2311026011019",
  accessCode: "QkbpxH",
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
};

async function authenticate() {
  try {
    const response = await axios.post('http://20.207.122.201/evaluation-service/auth', authData);
    console.log('Authentication Successful:', response.data);
  } catch (error) {
    console.error('Authentication Failed:', error.response ? error.response.data : error.message);
  }
}

authenticate();
