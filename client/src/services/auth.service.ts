import axios from 'axios';

export class AuthService {
  setToken(token: string) {
    localStorage.setItem('auth', token)
  }

  getToken(): string | null {
    return localStorage.getItem('auth')
  }

  withAuth() {
    return { headers: { Authorization: `Bearer ${this.getToken()}` } }
  }

  signIn(login: string, password: string): Promise<void> {
    return axios.post('/api/auth/login', { username: login, password })
      .then(res => {
        this.setToken(res.data.access_token)
      })
  }

  signUp(login: string, password: string): Promise<void> {
    return axios.post('/api/auth/signup', { username: login, password })
      .then(res => {
        this.setToken(res.data.access_token)
      })
  }
}

export const authService = new AuthService()
