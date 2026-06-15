import CountryList from "./CountryList"
import CountryDescription from "./CountryDescription"

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