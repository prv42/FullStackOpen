import axios from "axios"

const API_KEY = import.meta.env.VITE_WEATHER_KEY
const baseUrl = "https://api.openweathermap.org/data/2.5/weather"

const get = (city) => {
  return axios
    .get(baseUrl, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric"
      }
    })
    .then(response => response.data)
}

export default { get }