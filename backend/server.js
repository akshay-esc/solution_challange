require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const GEMMA_API_KEY = process.env.GEMMA_API_KEY;

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
      
      // Node 18+ has built-in fetch
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

  // Construct the final alert object
  const alertObject = {
    id: Date.now(),
    type: "critical",
    title: "AI Risk Alert: Weather Disruption",
    description: generatedDescription,
    time: "Just now",
    location: "New York, NY",
    shipmentId: "SHP-110" // Matches our Rotterdam -> NY shipment
  };

  res.json({ alert: alertObject });
});

app.listen(PORT, () => {
  console.log(`Gemma Backend Server running on http://localhost:${PORT}`);
});
