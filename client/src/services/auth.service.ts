import axios from 'axios';

export class AuthService {
    isAuthorized(): Promise<Boolean> {
        return Promise.resolve(
            !!localStorage.getItem('auth') || false
        )
    }

    signIn(login: string, password: string): Promise<void> {
        console.log({login, password})
        localStorage.setItem('auth', '1')

        return Promise.resolve()
    }

    signUp(login: string, password: string): Promise<void> {
        return axios.post('/api/auth/signup', {login, password})
            .then(() => void 0)
    }
}

export const authService = new AuthService()
