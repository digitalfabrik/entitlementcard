import {createContext, ReactNode, useState} from "react"
import {
    signIn_signInPayload as SignInPayload,
    signIn_signInPayload_user as Administrator
} from "./graphql/auth/__generated__/signIn";

interface AuthContextData {
    token: string,
    expiry: Date,
    administrator: Administrator
}

export const AuthContext = createContext<[AuthContextData | null, (payload: SignInPayload) => void]>([null, () => {}])

const getExpiryFromToken = (token: string) => {
    const payload: { exp: number } = JSON.parse(atob(token.split('.')[1]))
    return new Date(payload.exp * 1000) // exp is in seconds, not milliseconds
}

const convertToAuthContextData: (payload: SignInPayload) => AuthContextData = (payload) => ({
    token: payload.token,
    administrator: payload.user,
    expiry: getExpiryFromToken(payload.token)
})

const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [authContextData, setAuthContextData] = useState<AuthContextData | null>(null)
    const setAuthContextDataFromPayload = (payload: SignInPayload) =>
        setAuthContextData(convertToAuthContextData(payload))

    return <AuthContext.Provider value={[authContextData, setAuthContextDataFromPayload]}>
        {children}
    </AuthContext.Provider>
}

export default AuthProvider
