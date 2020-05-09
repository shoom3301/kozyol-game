import React, { Component } from 'react'
import { Button } from 'ui-elements/button'

export interface ConfirmButtonProps {
  confirm: () => void
  timeout: number
}

export interface ConfirmButtonState {
  timer: number | null
  current: number
  disabled: boolean
}

export class ConfirmButton extends Component<ConfirmButtonProps, any> {
  state: ConfirmButtonState = { timer: null, current: 0, disabled: false }

  componentDidUpdate(prevProps: Readonly<ConfirmButtonProps>, prevState: Readonly<any>) {
    if (this.props.timeout !== prevProps.timeout) {
      this.updateTimer()
    }
  }

  componentDidMount() {
    this.updateTimer()
  }

  componentWillUnmount() {
    if (this.state.timer) window.clearInterval(this.state.timer)
  }

  updateTimer() {
    if (this.state.timer) window.clearInterval(this.state.timer)

    const timer = window.setInterval(() => {
      const newCurrent = this.state.current - 1000

      this.setState({ ...this.state, current: newCurrent }, () => {
        if (newCurrent <= 0) {
          if (this.state.timer) window.clearInterval(this.state.timer)
          this.setState({ timer: null, current: 0, disabled: true }, () => {
            this.props.confirm()
          })
        }
      })
    }, 1000)

    this.setState({ timer, current: this.props.timeout, disabled: false })
  }

  render(): React.ReactElement {
    return (
      this.state.disabled ? <span/> :
        <Button onClick={() => this.props.confirm()}>
          Продолжить ({this.state.current / 1000})
        </Button>
    )
  }
}
