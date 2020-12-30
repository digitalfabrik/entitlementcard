import React from "react";
import {Button, Navbar} from "@blueprintjs/core";

export class Navigation extends React.Component<any, any> {

    render() {
        return (
            <Navbar>
                <Navbar.Group>
                    <Navbar.Heading>Ehrenamtskarte Administration</Navbar.Heading>
                    <Navbar.Divider />
                    <Button className="bp3-minimal" icon="home" text="Home" />
                    <Button className="bp3-minimal" icon="people" text="Karten" />
                    <Button className="bp3-minimal" icon="list" text="Akzeptanzstellen" />
                </Navbar.Group>
            </Navbar>
        )
    }

}
