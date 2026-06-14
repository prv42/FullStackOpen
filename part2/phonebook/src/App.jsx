import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const showNotification = message => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const addNewPerson = (event) => {
    event.preventDefault()

    if (!newName.trim() || !newNumber.trim()) return

    const person = persons.find(person => person.name === newName)

    if (person) {
      if (person.number === newNumber) {
        alert(`${newName} is already added to phonebook`)
      } else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(person.id, { ...person, number: newNumber })
          .then(returnedPerson => {
            setPersons(prev => prev.map(p => p.id === person.id ? returnedPerson : p))
            setNewName("")
            setNewNumber("")
            showNotification(`Updated ${returnedPerson.name}`)
          })
          .catch(() => setPersons(prev => prev.filter(p => p.id !== person.id)))
      }
      return
    }

    personService
      .create({ name: newName, number: newNumber })
      .then(returnedPerson => {
        setPersons(prev => prev.concat(returnedPerson))
        setNewName("")
        setNewNumber("")
        showNotification(`Added ${returnedPerson.name}`)
      })
  }

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleFilterChange = event => setFilter(event.target.value)

  const handleDelete = person => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .deletePerson(person.id)
        .then(() => setPersons(prev => prev.filter(p => p.id !== person.id)))
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addNewPerson} nameValue={newName} numberValue={newNumber} onNameChange={handleNameChange} onNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} onDelete={handleDelete} />
    </div>
  )
}

export default App