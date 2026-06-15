const SearchResults = ({ countries }) => {
  if (!countries) return null

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (countries.length > 1) {
    return <div>{countries.map(country => <div key={country.cca2}>{country.name.common}</div>)}</div>
  } else if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name.common}</h1>
        <div>Capital {countries[0].capital}</div>
        <div>Area {countries[0].area}</div>
        <h2>Languages</h2>
        <ul>{Object.entries(countries[0].languages).map(([code, language]) => <li key={code}>{language}</li>)}</ul>
        <img src={countries[0].flags.png} alt={countries[0].flags.alt} />
      </div>
    )
  }
}

export default SearchResults