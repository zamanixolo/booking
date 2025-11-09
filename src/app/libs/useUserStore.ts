'use client'
import { create } from 'zustand'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  token?: string
}

interface UserState {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, error: null }),
}))
