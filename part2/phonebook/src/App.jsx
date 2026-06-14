import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ value, onChange }) => <div>filter shown with <input value={value} onChange={onChange} /></div>

const PersonForm = ({ onSubmit, nameValue, numberValue, onNameChange, onNumberChange}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={nameValue} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={numberValue} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person }) => <div>{person.name} {person.number}</div>

const Persons = ({ persons }) => persons.map(person => <Person key={person.id} person={person} />)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => setPersons(response.data))
  }, [])

  const addNewPerson = (event) => {
    event.preventDefault()

    if (!newName.trim() || !newNumber.trim()) return

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    axios
      .post("http://localhost:3001/persons", personObject)
      .then(response => {
        setPersons(prev => prev.concat(response.data))
        setNewName("")
        setNewNumber("")
      })
  }

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleFilterChange = event => setFilter(event.target.value)

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addNewPerson} nameValue={newName} numberValue={newNumber} onNameChange={handleNameChange} onNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App