const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const supersetUrl = 'http://ec2-65-0-6-225.ap-south-1.compute.amazonaws.com';
const dashboardId = 'b4f32e04-a9d9-4079-a0c1-30f0c678c9e9';
const username = 'admin';
const password = 'admin';

// Endpoint to get the guest token
app.post('/get-guest-token', async (req, res) => {
  try {
    // Step 1: Get the access token
    const loginResponse = await axios.post(`${supersetUrl}/api/v1/security/login`, {
      username,
      password,
      provider: 'db',
      refresh: true,
    });

    const accessToken = loginResponse.data.access_token;
    console.log("Access token: ", accessToken)

    // Step 2: Get the guest token for embedding
    const guestTokenResponse = await axios.post(`${supersetUrl}/api/v1/security/guest_token/`, {
        "resources": [
            {
                "type": "dashboard",
                "id": dashboardId
            }
        ],
        "rls": [],
        "user": {
            "username": "dashboarduser",
            "first_name": "Dashboard",
            "last_name": "User"
        }
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log("Guest Token: ", guestTokenResponse.data.token)

    res.json({ token: guestTokenResponse.data.token });
  } catch (error) {
    console.error('Error fetching guest token:', error.response.data);
    res.status(500).send('Failed to get guest token');
  }
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
