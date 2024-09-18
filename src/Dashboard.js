import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { embedDashboard } from "@superset-ui/embedded-sdk";


const Dashboard = () => {
  const [guestToken, setGuestToken] = useState(null);
  const supersetUrl = 'http://ec2-65-0-6-225.ap-south-1.compute.amazonaws.com'; // Superset base URL
  const dashboardId = 'b4f32e04-a9d9-4079-a0c1-30f0c678c9e9'; // Replace with your Superset dashboard ID

  // Function to get guest token from the backend
  const fetchGuestToken = async () => {
    try {
      const response = await axios.post('http://localhost:9000/get-guest-token'); // Call your backend
      console.log(response.data.token)
      setGuestToken(response.data.token);
      return response.data.token
    } catch (error) {
      console.error('Error fetching guest token:', error);
    }
  };

  useEffect(() => {
    const embed = async () => {
      await embedDashboard({
        id: "b4f32e04-a9d9-4079-a0c1-30f0c678c9e9", // given by the Superset embedding UI
        supersetDomain: "http://ec2-65-0-6-225.ap-south-1.compute.amazonaws.com",
        mountPoint: document.getElementById("dashboard"), // html element in which iframe render
        fetchGuestToken: () => fetchGuestToken(),
        dashboardUiConfig: {
          hideTitle: true,
          hideChartControls: true,
          hideTab: true,
        },
      })
    }
    if (document.getElementById("dashboard")) {
      embed()
    }
  }, [])

  // embedDashboard({
  //   id: "b4f32e04-a9d9-4079-a0c1-30f0c678c9e9", // given by the Superset embedding UI
  //   supersetDomain: "http://ec2-65-0-6-225.ap-south-1.compute.amazonaws.com/superset/dashboard/11",
  //   mountPoint: document.getElementById("dashboard-container"), // any html element that can contain an iframe
  //   fetchGuestToken: () => fetchGuestToken(),
  //   dashboardUiConfig: { // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional), urlParams (optional)
  //       hideTitle: true,
  //       filters: {
  //           expanded: true,
  //       }
  //   },
  //     // optional additional iframe sandbox attributes
  //   iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
  // });

  return (
    <div className="dashboard-container" id="dashboard">
      {/* {true ? (
        <iframe
          title="Superset Dashboard"
          src={`${supersetUrl}/embedded/${dashboardId}?token=${guestToken}&standalone=true`}
          width="100%"
          height="800px"
          frameBorder="0"
        />
      ) : (
        <p>Loading dashboard...</p>
      )} */}
      
    </div>
  );
};

export default Dashboard;
