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

const CountryDescription = ({ country }) => {
  if (!country) return null

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital[0]}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>{Object.entries(country.languages).map(([code, language]) => <li key={code}>{language}</li>)}</ul>
      <img src={country.flags.png} alt={country.flags.alt} />
    </div>
  )
}

const SearchResults = ({ countries, selectedCountry, setSelectedCountry }) => {
  if (selectedCountry) {
    return <CountryDescription country={selectedCountry} />
  } else if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length > 1) {
    return <CountryList countries={countries} setSelectedCountry={setSelectedCountry} />
  } else if (countries.length === 1) {
    return <CountryDescription country={countries[0]} />
  } else {
    return null
  }
}

export default SearchResults