import React, { Component } from 'react';

class Timer extends Component {
  state = {
    msElapsed: 0,
    displayTime: "0.0",
    timerId: null,
    timerIsOn: false
  }

  componentDidUpdate (prevProps) {
    if (prevProps.textEntered !== this.props.textEntered) {
      if (this.props.textEntered) {
        this.startTimer();
      } else {
        this.stopAndResetTimer();
      }
    }
    if (prevProps.finished !== this.props.finished) {
      this.stopTimer();
      this.props.getFinalTime(this.state.msElapsed);
    }
  }

  startTimer = () => {
    let msElapsed = this.state.msElapsed;
    const timerId = setInterval(() => {
      msElapsed += 0.1;
      const displayTime = Number.parseFloat(msElapsed).toFixed(1)
      this.setState({msElapsed, displayTime, timerId, timerIsOn: true});
    }, 100);

  }  

  stopAndResetTimer = () => {
    clearInterval(this.state.timerId);
    const state = {
      msElapsed: 0,
      displayTime: "0.0",
      timerId: null,
      timerIsOn: false
    }
    this.setState({...state});
  }

  stopTimer = () => {
    clearInterval(this.state.timerId);
    const state = {
      msElapsed: 0,
      displayTime: "0.0",
      timerId: null,
      timerIsOn: false
    }
    this.setState({...state})
  }

  render() {
    return (
      <div className={`timer-display ${this.state.timerIsOn ? '--active' : ''} `}>
        <span className={`${this.state.timerIsOn ? 'pulse' : ''} `}>
          {this.props.finished ? this.state.msElapsed : this.state.displayTime} seconds
        </span>
      </div>
    )
  }
}

export default Timer;