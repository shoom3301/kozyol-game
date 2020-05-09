import axios from 'axios'
import { apiUrl } from 'helpers/apiUrl'

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
    return axios.post(apiUrl('/auth/login'), { username: login, password }).then((res) => {
      this.setToken(res.data.access_token)
    })
  }

  signUp(login: string, password: string): Promise<void> {
    return axios.post(apiUrl('/auth/signup'), { username: login, password }).then(() => void 0)
  }
}

export const authService = new AuthService()
