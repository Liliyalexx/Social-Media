const axios = require("axios");
require("dotenv").config(); 

const generateImage = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepai.org/api/text2img",
      { text: prompt }, 
      {
        headers: {
          "Api-Key": process.env.DEEP_AI_API_KEY, 
        },
      }
    );

    if (response.status === 200) {
      return response.data.output_url; 
      throw new Error(`${response.status}: ${response.data}`);
    }
  } catch (error) {
    console.error("Error generating image with DeepAI:", error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = generateImage;