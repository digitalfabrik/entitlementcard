import {createContext, ReactNode, useState} from "react"
import {Administrator, SignInPayload} from "./generated/graphql";

export interface AuthContextData {
    token: string,
    expiry: Date,
    administrator: Administrator,
    password: string
}

const noop = () => {
}

export const AuthContext =
    createContext<[
        AuthContextData | null,
        (payload: SignInPayload, password: string) => void,
        () => void]>
    ([null, noop, noop])

const getExpiryFromToken = (token: string) => {
    const payload: { exp: number } = JSON.parse(atob(token.split('.')[1]))
    return new Date(payload.exp * 1000) // exp is in seconds, not milliseconds
}

const convertToAuthContextData: (payload: SignInPayload, password: string) => AuthContextData = (payload, password) => ({
    token: payload.token,
    administrator: payload.user,
    expiry: getExpiryFromToken(payload.token),
    password
})

const AuthProvider = ({children}: { children: ReactNode }) => {
    const [authContextData, setAuthContextData] = useState<AuthContextData | null>(null)
    const onLogIn = (payload: SignInPayload, password: string) =>
        setAuthContextData(convertToAuthContextData(payload, password))
    const onLogOut = () => setAuthContextData(null)

    return <AuthContext.Provider value={[authContextData, onLogIn, onLogOut]}>
        {children}
    </AuthContext.Provider>
}

export default AuthProvider
