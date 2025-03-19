// middlewares/weatherMiddleware.js
const getWeather = require("../utils/weather");

const fetchWeather = (city = "Seattle") => async (req, res, next) => {
  const city = "Seattle"; 
  try {
    const weather = await getWeather(city);
    req.weather = weather; 
  } catch (error) {
    console.error("Error fetching weather data:", error);
    req.weather = null; 
  }
  next(); 
};

module.exports = fetchWeather;