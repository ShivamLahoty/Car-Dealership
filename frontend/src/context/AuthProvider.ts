import { useState } from 'react'
import type { ReactNode } from 'react'
import api from '../api'
import type { User } from '../types'
import { AuthContext } from './authContext'

function loadUser(): User | null {
  const saved = localStorage.getItem('user')
  return saved ? JSON.parse(saved) : null
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUser)

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
  }

  async function register(email: string, password: string, role: string) {
    await api.post('/auth/register', { email, password, role })
    await login(email, password)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}