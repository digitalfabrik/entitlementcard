import {ApolloError, useMutation} from "@apollo/client";
import React from "react";
import styled from "styled-components";
import {signIn as SignInCarrier, signIn_signInPayload as SignInPayload} from "../../graphql/auth/__generated__/signIn";
import LoginForm from "./LoginForm";
import {SIGN_IN} from "../../graphql/auth/mutations";
import {LoginToaster} from "../AppToaster";
import {Card, H2} from "@blueprintjs/core";

interface Props {
    onSignIn: (payload: SignInPayload, password: string) => void
}

const Center = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 40px;
`

const onError = function (error: ApolloError) {
    LoginToaster.show({message: "Login failed"});
}

interface State {
    email: string
    password: string
}

const Login = (props: Props) => {
    const [state, setState] = React.useState<State>({email: "", password: ""})
    const [signIn, mutationState] = useMutation(SIGN_IN, {
        onCompleted: (payload: SignInCarrier) => props.onSignIn(payload.signInPayload, state.password),
        onError: onError
    })
    const onSubmit = () => signIn({variables: {authData: {email: state.email, password: state.password}}})

    return <Center>
        <Card>
            <H2>Ehrenamtskarte Verwaltung</H2>
            <LoginForm password={state.password} email={state.email} setEmail={email => setState({...state, email})}
                       setPassword={password => setState({...state, password})}
                       onSubmit={onSubmit} loading={mutationState.loading}/>
        </Card>
    </Center>
}

export default Login
