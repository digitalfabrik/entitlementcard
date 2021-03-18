import {ApolloError, useMutation} from "@apollo/client";
import React from "react";
import styled from "styled-components";
import {signIn as SignInCarrier, signIn_signInPayload as SignInPayload} from "../../graphql/auth/__generated__/signIn";
import LoginForm from "./LoginForm";
import {SIGN_IN} from "../../graphql/auth/mutations";
import {LoginToaster} from "../AppToaster";
import {Card, H2} from "@blueprintjs/core";

interface Props {
    onSignIn: (payload: SignInPayload) => void
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

const Login = (props: Props) => {
    const [signIn, mutationState] = useMutation(SIGN_IN, {
        onCompleted: (payload: SignInCarrier) => props.onSignIn(payload.signInPayload),
        onError: onError
    })
    const onSubmit = (email: string, password: string) => signIn({variables: {authData: {email, password}}})

    return <Center>
        <Card>
            <H2>Ehrenamtskarte Verwaltung</H2>
            <LoginForm onSubmit={onSubmit} loading={mutationState.loading}/>
        </Card>
    </Center>
}

export default Login
