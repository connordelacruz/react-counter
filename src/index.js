import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      val: 0,
    }
  }

  handleClick(amountToAdd) {
    const currentVal = this.state.val
    this.setState({
      val: currentVal + amountToAdd,
    })
  }

  render() {
    return (
      <div className='counter'>
        <button
          className='counter-button'
          onClick={() => this.handleClick(-1)}>
          -
        </button>
        <span className='counter-value'>{this.state.val}</span>
        <button
          className='counter-button'
          onClick={() => this.handleClick(1)}>
          +
        </button>
      </div>
    )
  }
}

// =============================================================================
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Counter/>)

