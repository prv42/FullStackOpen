import { useState } from 'react'

const Title = ({ name }) => <h1>{name}</h1>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Display = ({ name, value }) => <p>{name} {value}</p>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodButton = () => setGood(prev => prev + 1)
  const handleNeutralButton = () => setNeutral(prev => prev + 1)
  const handleBadButton = () => setBad(prev => prev + 1)

  return (
    <div>
      <Title name="give feedback" />
      <Button handleClick={handleGoodButton} text="good" />
      <Button handleClick={handleNeutralButton} text="neutral" />
      <Button handleClick={handleBadButton} text="bad" />
      <Title name="statistics" />
      <Display name="good" value={good} />
      <Display name="neutral" value={neutral} />
      <Display name="bad" value={bad} />
    </div>
  )
}

export default App