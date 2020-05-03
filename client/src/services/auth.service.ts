import axios from 'axios';

export class AuthService {
    isAuthorized(): Promise<Boolean> {
        return Promise.resolve(
            !!localStorage.getItem('auth') || false
        )
    }

    signIn(login: string, password: string): Promise<void> {
        return axios.post('/api/auth/login', {username: login, password})
            .then(res => {
                localStorage.setItem('auth', res.data.access_token)
            })
    }

    signUp(login: string, password: string): Promise<void> {
        return axios.post('/api/auth/signup', {username: login, password})
            .then(res => {
                localStorage.setItem('auth', res.data.access_token)
            })
    }
}

export const authService = new AuthService()
