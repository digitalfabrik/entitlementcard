import {useMutation} from "@apollo/client";
import React from "react";
import styled from "styled-components";
import {signIn_signInPayload as SignInPayload} from "../../graphql/auth/__generated__/signIn";
import LoginForm from "./LoginForm";
import {SIGN_IN} from "../../graphql/auth/mutations";

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

const Login = (props: Props) => {
    const [signIn, mutationState] = useMutation(SIGN_IN, {onCompleted: props.onSignIn})
    const onSubmit = (email: string, password: string) => signIn({ variables: {email, password}})

    return <Center>
        <LoginForm onSubmit={onSubmit} loading={mutationState.loading}/>
    </Center>
}

export default Login
