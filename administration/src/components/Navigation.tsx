import React from "react";
import {Button, Navbar} from "@blueprintjs/core";
import {NavLink} from "react-router-dom";
import {Alignment} from "@blueprintjs/core/lib/esm/common/alignment";

const Navigation = () => {
    return (
        <Navbar fixedToTop={true}>
            <Navbar.Group>
                <Navbar.Heading>Ehrenamtskarte Administration</Navbar.Heading>
                <Navbar.Divider />
                <NavLink to={"/"}><Button className="bp3-minimal" icon="home" text="Home" /></NavLink>
                <NavLink to={"/eak-generation"}><Button className="bp3-minimal" icon="people" text="Karten" /></NavLink>
                <NavLink to={"/accepting-stores"}><Button className="bp3-minimal" icon="list" text="Akzeptanzstellen" /></NavLink>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <NavLink to={"/login"}><Button className="bp3-minimal" icon="log-out" text="Logout" /></NavLink>
            </Navbar.Group>
        </Navbar>
    )
};

export default Navigation;

