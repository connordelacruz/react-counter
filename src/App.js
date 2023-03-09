import { useState } from 'react'


function Counter({ value, decrementOnClick, incrementOnClick }) {
  return (
    <div className='counter'>
      <button
        className='counter-button decrement'
        onClick={decrementOnClick}>
        -
      </button>
      <span className='counter-value'>{value}</span>
      <button
        className='counter-button increment'
        onClick={incrementOnClick}>
        +
      </button>
    </div>
  )
}


function CounterList() {
  const [counters, setCounters] = useState([{ value: 0}])

  function handleCounterButtonClick(i, amountToAdd) {
    const newCounters = [...counters]
    newCounters[i].value = newCounters[i].value + amountToAdd
    setCounters(newCounters)
  }

  function renderCounter(i) {
    return (
      <Counter
        value={counters[i].value}
        incrementOnClick={() => handleCounterButtonClick(i, 1)}
        decrementOnClick={() => handleCounterButtonClick(i, -1)}
      />
    )
  }

  function handleNewCounterButtonClick() {
    const newCounter = {
      value: 0,
    }
    const newCounters = [...counters, newCounter]
    setCounters(newCounters)
  }

  const counterList = counters.map((counter, i) => {
    return (
      <li key={i}>
        {renderCounter(i)}
      </li>
    )
  })
  return (
    <div className='counter-list-container'>
      <ul className='counter-list'>{counterList}</ul>
      <button
        className='counter-list-new-counter-button'
        onClick={() => handleNewCounterButtonClick()}
      >
        Create New Counter
      </button>
    </div>
  )
}


export default function AppContainer() {
    return (
      <div className="app-container">
        <h2>Counters</h2>
        <CounterList />
      </div>
    )
}
