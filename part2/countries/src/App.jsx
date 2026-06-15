import { useState, useEffect } from "react"

import SearchBar from "./components/SearchBar"
import SearchResults from "./components/SearchResults"

import countryService from "./services/countries"

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    countryService
      .getAll()
      .then(setCountries)
  }, [])

  const handleQueryChange = event => setQuery(event.target.value)
  const normalizedQuery = query.trim().toLowerCase()
  const countriesToShow = query ? countries.filter(country => country.name.common.toLowerCase().includes(normalizedQuery)) : []

  return (
    <div>
      <SearchBar value={query} onChange={handleQueryChange} />
      <SearchResults countries={countriesToShow} />
    </div>
  )
}

export default App