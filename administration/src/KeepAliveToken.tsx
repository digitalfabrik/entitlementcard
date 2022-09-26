import {useMutation} from "@apollo/client";
import {Button, Classes, Dialog} from "@blueprintjs/core";
import React, {ReactNode, useContext, useEffect, useState} from "react";
import {AuthContextData} from "./AuthProvider";
import {AppToaster} from "./components/AppToaster";
import {SignInDocument, SignInMutation, SignInMutationVariables, SignInPayload} from "./generated/graphql";
import {ProjectConfigContext} from "./project-configs/ProjectConfigContext";

interface Props {
    authData: AuthContextData,
    children: ReactNode,
    onSignIn: (payload: SignInPayload, password: string) => void,
    onSignOut: () => void
}

const KeepAliveToken = (props: Props) => {
    const projectId = useContext(ProjectConfigContext).projectId
    const [timeLeft, setTimeLeft] = useState(Math.round((props.authData.expiry.valueOf() - Date.now()) / 1000))
    useEffect(() => {
        setTimeout(() => setTimeLeft(Math.round((props.authData.expiry.valueOf() - Date.now()) / 1000)), 1000)
    })

    const [signIn, mutationState] = useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, {
        onCompleted: (payload) => props.onSignIn(payload.signInPayload, props.authData.password),
        onError: () => AppToaster.show({intent: "danger", message: "Etwas ist schief gelaufen."})
    })
    const extendLogin = () => signIn({
        variables: {
            project: projectId,
            authData: {
                email: props.authData.administrator.email,
                password: props.authData.password
            }
        }
    })

    return <>
        {props.children}
        <Dialog isOpen={timeLeft <= 30} title={"Ihr Login-Zeitraum läuft ab!"} icon={"warning-sign"}
                isCloseButtonShown={false}>
            <div className={Classes.DIALOG_BODY}>
                {
                    timeLeft >= 0
                        ? <p>Ihr Login-Zeitraum läuft in {timeLeft} Sekunden ab.</p>
                        : <p>Ihr Login-Zeitraum ist abgelaufen.</p>
                }
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button onClick={props.onSignOut} loading={mutationState.loading}>Ausloggen</Button>
                    <Button intent={"primary"} onClick={extendLogin} loading={mutationState.loading}>
                        Login-Zeitraum verlängern
                    </Button>
                </div>
            </div>
        </Dialog>
    </>
}

export default KeepAliveToken
