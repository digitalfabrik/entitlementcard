import React, { ReactElement, ReactNode, createContext, useMemo, useState } from 'react'

import { SignInPayload } from './generated/graphql'

export type TokenPayload = {
  token: string
  expiry: Date
  adminId: number
}

const noop = () => undefined

export const AuthContext = createContext<{
  data: TokenPayload | null
  signIn: (payload: SignInPayload) => void
  signOut: () => void
}>({ data: null, signIn: noop, signOut: noop })

const LOCAL_STORAGE_KEY = 'auth-token'

const loadToken = () => window.localStorage.getItem(LOCAL_STORAGE_KEY)
const storeToken = (token: string) => window.localStorage.setItem(LOCAL_STORAGE_KEY, token)
const removeToken = () => window.localStorage.removeItem(LOCAL_STORAGE_KEY)

const extractTokenPayload = (token: string): TokenPayload => {
  const payload: { exp: number; adminId: number } = JSON.parse(atob(token.split('.')[1]))
  const expiry = new Date(payload.exp * 1000) // exp is in seconds, not milliseconds
  return { token, expiry, adminId: payload.adminId }
}

const loadTokenPayload = (): TokenPayload | null => {
  const token = loadToken()
  if (token === null) {
    return null
  }

  try {
    const { expiry, adminId } = extractTokenPayload(token)
    if (expiry < new Date()) {
      removeToken()
      return null
    }
    return { token, expiry, adminId }
  } catch (e) {
    console.error(e)
    removeToken()
  }
  return null
}

const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [tokenPayload, setTokenPayload] = useState<TokenPayload | null>(loadTokenPayload())
  const contextValue = useMemo(
    () => ({
      data: tokenPayload,
      signIn: (payload: SignInPayload) => {
        const tokenPayload = extractTokenPayload(payload.token)
        storeToken(payload.token)
        setTokenPayload(tokenPayload)
      },
      signOut: () => {
        removeToken()
        setTokenPayload(null)
      },
    }),
    [tokenPayload]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthProvider
