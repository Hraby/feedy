"use client";
import { createContext, useContext, ReactNode } from 'react'
import { User } from '@/types/auth'

const AuthContext = createContext<User | null>(null)

export function AuthProvider({
  children,
  user,
}: {
  children: ReactNode
  user: User | null
}) {
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}