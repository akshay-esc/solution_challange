require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

let { kpiData, alertsData, shipmentsData } = require('./data');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../dist')));

const GEMMA_API_KEY = process.env.GEMMA_API_KEY;

// GET Dashboard State
app.get('/api/dashboard', (req, res) => {
  res.json({ kpiData, alertsData, shipmentsData });
});

// POST Reroute Shipment
app.post('/api/reroute', (req, res) => {
  const { shipmentId, alertId } = req.body;

  // Update Shipment
  shipmentsData = shipmentsData.map(ship => {
    if (ship.id === shipmentId && ship.standbyDest) {
      return {
        ...ship,
        dest: ship.standbyDest,
        destLat: ship.standbyLat,
        destLng: ship.standbyLng,
        status: 'warning'
      };
    }
    return ship;
  });

  // Update Alert
  alertsData = alertsData.map(alert => {
    if (alert.id === alertId) {
      return {
        ...alert,
        type: 'info',
        title: 'Shipment Rerouted',
        description: `Successfully diverted to standby port. Route updated.`,
        shipmentId: null
      };
    }
    return alert;
  });

  res.json({ success: true, shipmentsData, alertsData });
});

app.post('/api/analyze-risk', async (req, res) => {
  const { weatherData, portData } = req.body;
  console.log("Received request to analyze risk via Gemma...");

  let generatedDescription = "Gemma analysis predicts a severe blizzard impacting the Port of New York within 72 hours. Reroute highly recommended.";

  if (!GEMMA_API_KEY || GEMMA_API_KEY === 'your_huggingface_api_key_here') {
    console.log("No valid API key found. Using simulated delay and fallback data...");
    await new Promise(resolve => setTimeout(resolve, 2500));
  } else {
    try {
      console.log("Calling Hugging Face Inference API for Gemma...");
      const prompt = `<start_of_turn>user\nYou are a supply chain risk analyzer. Generate a short, 2-sentence alert description based on this data. Weather: ${weatherData}, Ports: ${portData}.<end_of_turn>\n<start_of_turn>model\n`;
      
      const response = await fetch("https://api-inference.huggingface.co/models/google/gemma-1.1-7b-it", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GEMMA_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 100, return_full_text: false }
        })
      });

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      if (result && result.length > 0 && result[0].generated_text) {
        generatedDescription = result[0].generated_text.trim();
        console.log("Successfully generated alert from Gemma!");
      }
    } catch (error) {
      console.error("Error calling Gemma API:", error.message);
      console.log("Falling back to simulated data so the demo doesn't break.");
    }
  }

  const alertObject = {
    id: Date.now(),
    type: "critical",
    title: "AI Risk Alert: Weather Disruption",
    description: generatedDescription,
    time: "Just now",
    location: "New York, NY",
    shipmentId: "SHP-110" 
  };

  // Add alert to memory database
  alertsData = [alertObject, ...alertsData];

  // Update shipment to critical
  shipmentsData = shipmentsData.map(ship => {
    if (ship.id === alertObject.shipmentId) {
      return { ...ship, status: 'critical', standbyDest: "Port of Boston", standbyLat: 42.3601, standbyLng: -71.0589 };
    }
    return ship;
  });

  res.json({ success: true, alertsData, shipmentsData });
});

// Fallback for React Router
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Export the Express API for Vercel Serverless
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`MVP Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
