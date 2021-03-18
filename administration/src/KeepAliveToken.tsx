import {useMutation} from "@apollo/client";
import {Button, Classes, Dialog} from "@blueprintjs/core";
import React, {ReactNode, useEffect, useState} from "react";
import {AuthContextData} from "./AuthProvider";
import {SIGN_IN} from "./graphql/auth/mutations";
import {signIn as SignInCarrier, signIn_signInPayload as SignInPayload} from "./graphql/auth/__generated__/signIn";
import {AppToaster} from "./components/AppToaster";

interface Props {
    authData: AuthContextData,
    children: ReactNode,
    onSignIn: (payload: SignInPayload, password: string) => void
}

const KeepAliveToken = (props: Props) => {
    const [timeLeft, setTimeLeft] = useState(Math.round((props.authData.expiry.valueOf() - Date.now()) / 1000))
    useEffect(() => {
        setTimeout(() => setTimeLeft(Math.round((props.authData.expiry.valueOf() - Date.now()) / 1000)), 1000)
    })

    const [signIn, mutationState] = useMutation(SIGN_IN, {
        onCompleted: (payload: SignInCarrier) => props.onSignIn(payload.signInPayload, props.authData.password),
        onError: () => AppToaster.show({intent: "danger", message: "Etwas ist schief gelaufen."})
    })
    const extendLogin = () => signIn({
        variables: {
            authData: {
                email: props.authData.administrator.email,
                password: props.authData.password
            }
        }
    })

    return <>
        {props.children}
        <Dialog isOpen={timeLeft <= 120} title={"Ihr Login-Zeitraum läuft ab!"} icon={"warning-sign"}
                isCloseButtonShown={false}>
            <div className={Classes.DIALOG_BODY}>
                <p>Sie werden in {timeLeft} Sekunden ausgeloggt. Damit verlieren Sie alle ungespeicherten Eingaben.</p>
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button intent={"primary"} onClick={extendLogin} loading={mutationState.loading}>
                        Login-Zeitraum verlängern
                    </Button>
                </div>
            </div>
        </Dialog>
    </>
}

export default KeepAliveToken
