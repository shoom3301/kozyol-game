import React, { Component } from 'react';
import { Button } from 'ui-elements/button';

export interface ConfirmButtonProps {
  confirm: () => void
}

export interface ConfirmButtonState {
  timer: number | null
  current: number
  disabled: boolean
}

const timeout = 10000

export class ConfirmButton extends Component<ConfirmButtonProps, any> {
  state: ConfirmButtonState = {timer: null, current: timeout, disabled: false}

  componentDidMount() {
    const timer = window.setInterval(() => {
      const newCurrent = this.state.current - 1000

      this.setState({...this.state, current: newCurrent}, () => {
        if (newCurrent <= 0) {
          if (this.state.timer) window.clearInterval(this.state.timer)
          this.setState({timer: null, current: 0, disabled: true}, () => {
            this.props.confirm()
          })
        }
      })
    }, 1000)

    if (this.state.timer) window.clearInterval(this.state.timer)

    this.setState({timer})
  }

  componentWillUnmount() {
    if (this.state.timer) window.clearInterval(this.state.timer)
  }

  render(): React.ReactElement {
    return (
      this.state.disabled ? <span/> :
      <Button onClick={() => this.props.confirm()}>
        ЭЭЭЭ, давай дальше, сайпал ({this.state.current / 1000})
      </Button>
    )
  }
}
