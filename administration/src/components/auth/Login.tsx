import {ApolloError, useMutation} from "@apollo/client";
import React from "react";
import styled from "styled-components";
import {signIn as SignInCarrier, signIn_signInPayload as SignInPayload} from "../../graphql/auth/__generated__/signIn";
import LoginForm from "./LoginForm";
import {SIGN_IN} from "../../graphql/auth/mutations";
import {AppToaster} from "../AppToaster";
import {Card, H2} from "@blueprintjs/core";

interface Props {
    onSignIn: (payload: SignInPayload, password: string) => void
}

const Center = styled("div")`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

interface State {
    email: string
    password: string
}

const Login = (props: Props) => {
    const [state, setState] = React.useState<State>({email: "", password: ""})
    const [signIn, mutationState] = useMutation(SIGN_IN, {
        onCompleted: (payload: SignInCarrier) => props.onSignIn(payload.signInPayload, state.password),
        onError: () => AppToaster.show({ intent: "danger", message: "Login fehlgeschlagen."})
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
