const axios = require('axios');

const registrationData = {
  email: "tp7053@srmist.edu.in",
  name: "Tamilselvan P",
  mobileNo: "9994371185",
  githubUsername: "https://github.com/tamilselvan526",
  rollNo: "RA2311026011019",
  accessCode: "QkbpxH" // Provided by user
};

async function register() {
  try {
    const response = await axios.post('http://20.207.122.201/evaluation-service/register', registrationData);
    console.log('Registration Successful:', response.data);
  } catch (error) {
    console.error('Registration Failed:', error.response ? error.response.data : error.message);
  }
}

register();
