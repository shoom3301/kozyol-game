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
        return Promise.resolve()
    }
}

export const authService = new AuthService()
