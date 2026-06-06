import { useState } from 'react'

const Title = ({ name }) => <h1>{name}</h1>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ text, value }) => <p>{text} {value}</p>

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good - bad) / all || 0
  const positive = 100 * good / all  || 0

  if (all === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  } else {
    return (
      <div>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positive} %`} />
      </div>
    )
  }
}

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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App