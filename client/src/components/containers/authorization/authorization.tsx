import React, {ChangeEvent, Component} from 'react';
import {UIInput} from 'ui-elements/input';
import {UIButton} from 'ui-elements/button';
import {Box, FormContainer, Label, Title, AuthorizationContainer, AuthLink} from './authorization.elements';
import {authorizationRoute, mainRoute, registrationRoute} from 'router/routerPaths';
import {authService} from 'services/auth.service';
import {history} from 'router/router';

interface AuthorizationState {
    login: string;
    password: string;
    formDisabled: boolean;
}

interface AuthorizationProps {
    isRegistration: boolean;
}

export class Authorization extends Component<AuthorizationProps, AuthorizationState> {
    state: AuthorizationState = {login: '', password: '', formDisabled: false};

    signIn = () => {
        const {login, password, formDisabled} = this.state;

        if (formDisabled) return;

        this.setState({...this.state, ...{formDisabled: true}});

        (this.props.isRegistration
            ? authService.signUp(login, password)
            : authService.signIn(login, password))
            .catch(error => {
                alert(error);
                this.setState({login: '', password: '', formDisabled: false});
            })
            .then(() => {
                history.replace(mainRoute)
            });
    }

    onChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, ...{login: event.target.value}})
    }

    onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({...this.state, ...{password: event.target.value}})
    }

    render(): React.ReactElement {
        return (
            <AuthorizationContainer>
                <FormContainer>
                    <Box>
                        <Title>{this.props.isRegistration ? 'Регистрация' : 'Авторизация'}</Title>
                    </Box>
                    <Box>
                        <Label>Логин:</Label>
                        <UIInput name="login"
                                 value={this.state.login}
                                 onChange={this.onChangeLogin}/>
                    </Box>
                    <Box>
                        <Label>Пароль:</Label>
                        <UIInput name="password"
                                 type="password"
                                 value={this.state.password}
                                 onChange={this.onChangePassword}/>
                    </Box>
                    <Box align="center">
                        <UIButton onClick={this.signIn}>
                            {this.props.isRegistration ? 'Зарегистрироваться' : 'Войти'}
                        </UIButton>
                        <AuthLink to={this.props.isRegistration ? authorizationRoute : registrationRoute}>
                            {this.props.isRegistration ? 'Авторизация' : 'Регистрация'}
                        </AuthLink>
                    </Box>
                </FormContainer>
            </AuthorizationContainer>
        )
    }
}
