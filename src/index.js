import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'


// TODO: convert to functional component
class Counter extends React.Component {
  render() {
    return (
      <div className='counter'>
        <button
          className='counter-button decrement'
          onClick={this.props.decrementOnClick}>
          -
        </button>
        <span className='counter-value'>{this.props.value}</span>
        <button
          className='counter-button increment'
          onClick={this.props.incrementOnClick}>
          +
        </button>
      </div>
    )
  }
}


class CounterList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counters: [
        {value: 0},
      ],
    }
  }

  handleCounterButtonClick(i, amountToAdd) {
    const counters = [...this.state.counters]
    const currentValue = counters[i].value
    counters[i].value = currentValue + amountToAdd
    this.setState({
      counters: counters,
    })
  }

  renderCounter(i) {
    return (
      <Counter
        value={this.state.counters[i].value}
        incrementOnClick={() => this.handleCounterButtonClick(i, 1)}
        decrementOnClick={() => this.handleCounterButtonClick(i, -1)}
      />
    )
  }

  handleNewCounterButtonClick() {
    const newCounter = {
      value: 0,
    }
    const counters = [...this.state.counters]
    this.setState({
      counters: counters.concat([newCounter]),
    })
  }

  render() {
    const counters = this.state.counters
    // TODO: add remove counter button
    const counterList = counters.map((counter, i) => {
      return (
        <li key={i}>
          {this.renderCounter(i)}
        </li>
      )
    })

    return (
      <div className='counter-list-container'>
        <h2 className='counter-list-header'>Counters</h2>
        <ul className='counter-list'>{counterList}</ul>
        <button
          className='counter-list-new-counter-button'
          onClick={() => this.handleNewCounterButtonClick()}
        >
          Create New Counter
        </button>
      </div>
    )
  }
}

// =============================================================================
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<CounterList />)

