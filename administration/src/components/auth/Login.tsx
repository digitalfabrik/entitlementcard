import {useMutation} from "@apollo/client";
import React, {useContext} from "react";
import styled from "styled-components";
import LoginForm from "./LoginForm";
import {useAppToaster} from "../AppToaster";
import {Card, H2} from "@blueprintjs/core";
import {SignInDocument, SignInMutation, SignInMutationVariables, SignInPayload} from "../../generated/graphql";
import {ProjectConfigContext} from "../../project-configs/ProjectConfigContext";

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
    const config = useContext(ProjectConfigContext)
    const appToaster = useAppToaster()
    const [state, setState] = React.useState<State>({email: "", password: ""})
    const [signIn, mutationState] = useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, {
        onCompleted: (payload: SignInMutation) => props.onSignIn(payload.signInPayload, state.password),
        onError: () => appToaster?.show({intent: "danger", message: "Login fehlgeschlagen."})
    })
    const onSubmit = () => signIn({
        variables: {
            project: config.projectId,
            authData: {email: state.email, password: state.password}
        }
    })

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
