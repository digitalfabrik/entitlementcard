import React, {ChangeEvent} from "react";
import {Button, FormGroup, InputGroup} from "@blueprintjs/core";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";


interface State {
    email: string
    password: string
}

interface Props {
    loading?: boolean
    onSubmit: (email: string, password: string) => void
}

const LoginForm = (props: Props) => {
    const [state, setState] = React.useState<State>({email: "", password: ""})
    return (
        <div style={{marginTop: "20px"}}>
            <FormGroup label="E-Mail">
                <InputGroup placeholder="erika.musterfrau@example.org"
                            autoFocus
                            value={state.email}
                            disabled={!!props.loading}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setState({
                                ...state,
                                email: event.target.value
                            })}/>
            </FormGroup>
            <FormGroup label="Passwort">
                <InputGroup placeholder="Passwort"
                            value={state.password}
                            disabled={!!props.loading}
                            type="password"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setState({
                                ...state,
                                password: event.target.value
                            })}/>
            </FormGroup>
            <Button
                text="Anmelden"
                type="submit"
                loading={!!props.loading}
                onClick={() => props.onSubmit(state.email, state.password)}>
            </Button>
        </div>
    )
};

export default LoginForm;
