import { useState, useEffect } from "react"
import weatherService from "../services/weather"

const CountryDescription = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital?.[0]

  useEffect(() => {
    setWeather(null)
    if (capital) {
      weatherService
        .get(capital)
        .then(setWeather)
    }
  }, [capital])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {capital}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>{Object.entries(country.languages ?? {}).map(([code, language]) => <li key={code}>{language}</li>)}</ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      {weather && (
        <>
          <h2>Weather in {capital}</h2>
          <div>Temperature {weather.main.temp} Celsius</div>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
          <div>Wind {weather.wind.speed} m/s</div>
        </>
      )}
    </div>
  )
}

export default CountryDescription