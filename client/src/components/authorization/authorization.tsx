import React, { ChangeEvent, Component } from 'react'
import { Input } from 'ui-elements/input'
import { Button } from 'ui-elements/button'
import { Box, FormContainer, FormLink, Label, Title } from 'ui-elements/form'
import { authorizationRoute, mainRoute, registrationRoute } from 'router/routerPaths'
import { authService } from 'services/auth.service'
import { history } from 'router/router'
import styled from 'styled-components'

interface AuthorizationState {
  login: string
  password: string
  formDisabled: boolean
}

interface AuthorizationProps {
  isRegistration: boolean
}

export class Authorization extends Component<AuthorizationProps, AuthorizationState> {
  state: AuthorizationState = { login: '', password: '', formDisabled: false }

  componentDidMount() {
    localStorage.removeItem('auth')
  }

  signIn = () => {
    const { login, password, formDisabled } = this.state

    if (formDisabled) return
    if (login.length < 3 || login.length > 12) {
      alert('Логин должен быть от 3 до 12 символов')
      return
    }

    this.setState({ ...this.state, ...{ formDisabled: true } })

    const request = this.props.isRegistration
      ? authService.signUp(login, password)
      : authService.signIn(login, password)

    request
      .catch(error => {
        alert(error)
        this.setState({ login: '', password: '', formDisabled: false })
      })
      .then(() => {
        history.replace(mainRoute)
      })
  }

  onChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, ...{ login: event.target.value } })
  }

  onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, ...{ password: event.target.value } })
  }

  render(): React.ReactElement {
    return (
      <AuthFormContainer>
        <Box>
          <Title>{this.props.isRegistration ? 'Регистрация' : 'Авторизация'}</Title>
        </Box>
        <Box>
          <Label>Логин:</Label>
          <Input name='login'
                 value={this.state.login}
                 onChange={this.onChangeLogin}/>
        </Box>
        <Box>
          <Label>Пароль:</Label>
          <Input name='password'
                 type='password'
                 value={this.state.password}
                 onChange={this.onChangePassword}/>
        </Box>
        <Box align='center'>
          <Button onClick={this.signIn}>
            {this.props.isRegistration ? 'Зарегистрироваться' : 'Войти'}
          </Button>
          <FormLink to={this.props.isRegistration ? authorizationRoute : registrationRoute}>
            {this.props.isRegistration ? 'Авторизация' : 'Регистрация'}
          </FormLink>
        </Box>
      </AuthFormContainer>
    )
  }
}

export const AuthFormContainer = styled(FormContainer)`
    width: 500px;
    margin: 0 auto;
`
