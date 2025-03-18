const axios = require("axios");

let cachedWeather = null;
let lastUpdated = null;

const getWeather = async (city, forceUpdate = false) => {
  const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check if cached data is still valid (24 hours) or if a force update is requested
  if (!forceUpdate && cachedWeather && lastUpdated && now - lastUpdated < oneDayInMs) {
    console.log("Returning cached weather data");
    return cachedWeather;
  }

  try {
    const response = await axios.get(url);
    cachedWeather = {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    };
    lastUpdated = now; // Update the last updated timestamp
    console.log("Fetched fresh weather data");
    return cachedWeather;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

module.exports = getWeather;