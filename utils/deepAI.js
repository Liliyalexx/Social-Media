const axios = require("axios");
require("dotenv").config(); // Load environment variables

const generateImage = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepai.org/api/text2img",
      { text: prompt }, // Send the prompt in the request body
      {
        headers: {
          "Api-Key": process.env.DEEP_AI_API_KEY, // Use the API key from .env
        },
      }
    );

    if (response.status === 200) {
      return response.data.output_url; // Return the generated image URL
    } else {
      throw new Error(`${response.status}: ${response.data}`);
    }
  } catch (error) {
    console.error("Error generating image with DeepAI:", error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = generateImage;