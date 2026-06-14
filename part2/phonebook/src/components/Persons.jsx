const Person = ({ person, onDelete }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={() => onDelete(person)}>delete</button>
    </div>
  )
}

const Persons = ({ persons, onDelete }) => persons.map(person => <Person key={person.id} person={person} onDelete={onDelete} />)

export default Persons