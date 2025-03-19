// const axios = require("axios");
// const FormData = require("form-data");

// const generateImage = async (prompt, outputFormat = "webp", height = 512, width = 512) => {
//   const formData = new FormData();
//   formData.append("prompt", prompt);
//   formData.append("output_format", outputFormat);
//   formData.append("height", height); // Add height
//   formData.append("width", width);   // Add width

//   try {
//     const response = await axios.post(
//       `https://api.stability.ai/v2beta/stable-image/generate/ultra`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
//           Accept: "image/*",
//           ...formData.getHeaders(), // Add multipart/form-data headers
//         },
//         responseType: "arraybuffer", // Ensure the response is treated as binary data
//       }
//     );

//     if (response.status === 200) {
//       return Buffer.from(response.data).toString("base64"); // Return base64-encoded image
//     } else {
//       throw new Error(`${response.status}: ${response.data.toString()}`);
//     }
//   } catch (error) {
//     console.error("Error generating image:", error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

// module.exports = generateImage;