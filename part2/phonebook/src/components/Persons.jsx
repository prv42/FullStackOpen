const Person = ({ person }) => <div>{person.name} {person.number}</div>

const Persons = ({ persons }) => persons.map(person => <Person key={person.id} person={person} />)

export default Persons