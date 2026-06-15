const CountryList = ({ countries, setSelectedCountry }) => {
  return (
    <div>
      {countries.map(country =>
        <div key={country.cca2}>
          {country.name.common} <button onClick={() => setSelectedCountry(country)}>Show</button>
        </div>
      )}
    </div>
  )
}

export default CountryList