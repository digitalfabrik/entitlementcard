import { createContext, ReactNode, useMemo, useState } from 'react'
import { Administrator, SignInPayload } from './generated/graphql'

export interface AuthData {
  token: string
  expiry: Date
  administrator: Administrator
}

const noop = () => {}

export const AuthContext = createContext<{
  data: AuthData | null
  signIn: (payload: SignInPayload) => void
  signOut: () => void
}>({ data: null, signIn: noop, signOut: noop })

const getExpiryFromToken = (token: string) => {
  const payload: { exp: number } = JSON.parse(atob(token.split('.')[1]))
  return new Date(payload.exp * 1000) // exp is in seconds, not milliseconds
}

const convertToAuthData: (payload: SignInPayload) => AuthData = payload => ({
  token: payload.token,
  administrator: payload.user,
  expiry: getExpiryFromToken(payload.token),
})

const LOCAL_STORAGE_KEY = 'authdata'

const loadAuthDataFromSessionStorage = (): AuthData | null => {
  const authDataRaw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
  if (authDataRaw === null) {
    return null
  }

  try {
    const partialAuthData: { token: string; administrator: Administrator } = JSON.parse(authDataRaw)
    const expiry = getExpiryFromToken(partialAuthData.token)
    if (expiry < new Date()) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY)
      return null
    }
    return { ...partialAuthData, expiry: getExpiryFromToken(partialAuthData.token) }
  } catch (e) {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
  return null
}

const saveAuthDataToSessionStorage = (authData: AuthData) => {
  window.localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      token: authData.token,
      administrator: authData.administrator,
    })
  )
}

const removeAuthDataFromSessionStorage = () => window.localStorage.removeItem(LOCAL_STORAGE_KEY)

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData | null>(loadAuthDataFromSessionStorage())
  const contextValue = useMemo(
    () => ({
      data: authData,
      signIn: (payload: SignInPayload) => {
        const authData = convertToAuthData(payload)
        saveAuthDataToSessionStorage(authData)
        setAuthData(authData)
      },
      signOut: () => {
        removeAuthDataFromSessionStorage()
        setAuthData(null)
      },
    }),
    [authData]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthProvider
