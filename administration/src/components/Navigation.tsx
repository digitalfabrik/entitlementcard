import React from "react";
import {Button, Navbar} from "@blueprintjs/core";
import {NavLink} from "react-router-dom";
import {Alignment} from "@blueprintjs/core/lib/esm/common/alignment";
import RegionSelector from "./RegionSelector";

const Navigation = () => {
    return (
        <Navbar>
            <Navbar.Group>
                <Navbar.Heading>Ehrenamtskarte Administration</Navbar.Heading>
                <Navbar.Divider />
                <RegionSelector />
                <Navbar.Divider />
                <NavLink to={"/"}><Button minimal icon="home" text="Home" /></NavLink>
                <NavLink to={"/eak-generation"}><Button minimal icon="people" text="Karten" /></NavLink>
                <NavLink to={"/accepting-stores"}><Button minimal icon="list" text="Akzeptanzstellen" /></NavLink>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <NavLink to={"/login"}><Button minimal icon="log-out" text="Logout" /></NavLink>
            </Navbar.Group>
        </Navbar>
    )
};

export default Navigation;
