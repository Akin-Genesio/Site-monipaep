import { createContext, ReactNode, useEffect, useState } from "react";
import Router from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies"

import { api } from "../services/apiClient";
import { SignInError } from "../errors/SignInError";

type User = {
  user: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel

export function signOut() {
  destroyCookie(undefined, 'monipaep.token')
  destroyCookie(undefined, 'monipaep.refreshToken')
  try {
    authChannel.postMessage('signOut')
  } catch (error) {
    console.log(error)
  }
  Router.push('/')
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const isAuthenticated = !!user

  useEffect(() => {
    authChannel = new BroadcastChannel('auth')

    authChannel.onmessage = (message) => {
      switch(message.data) {
        case 'signOut':
          signOut()
          authChannel?.close()
          break
        default:
          break
      }
    }
  }, [])

  useEffect(() => {
    const { 'monipaep.token': token } = parseCookies()

    if(token) {
      api.get('/systemuser/me').then(response => {
        const { user, permissions, roles } = response.data
        setUser({ user, permissions, roles})
      })
      .catch(() => {
        signOut()
      })
    }
  }, [])

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.get('/systemuser/login', {
        auth: {
          username: email,
          password,
        }
      })

      const { 
        user, 
        permissions, 
        roles, 
        token, 
        refreshToken 
      } = response.data

      setCookie(undefined, 'monipaep.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })

      setCookie(undefined, 'monipaep.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      
      setUser({ user, permissions, roles})

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
    } catch (error: any) {
      throw new SignInError(error.response.data.error)
    }
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}