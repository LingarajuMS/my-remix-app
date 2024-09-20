import axios from 'axios';

const API_KEY = 'YOUR_WEATHER_API_KEY';
const BASE_URL = 'https://api.weatherapi.com/v1';

export async function fetchWeather(city: string) {
  const response = await axios.get(`${BASE_URL}/current.json`, {
    params: { key: API_KEY, q: city },
  });
  return response.data;
}