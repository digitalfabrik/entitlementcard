import React, {useContext} from "react";
import {Button, Navbar} from "@blueprintjs/core";
import {NavLink} from "react-router-dom";
import {Alignment} from "@blueprintjs/core/lib/esm/common/alignment";
import RegionSelector from "./RegionSelector";
import {ProjectConfigContext} from "../project-configs/ProjectConfigContext";

interface Props {
    onSignOut: () => void
}

const Navigation = (props: Props) => {
    const config = useContext(ProjectConfigContext)
    return (
        <Navbar>
            <Navbar.Group>
                <Navbar.Heading>{config.name} Verwaltung</Navbar.Heading>
                <Navbar.Divider/>
                <RegionSelector/>
                <Navbar.Divider/>
                <NavLink to={"/"}><Button minimal icon="home" text="Home"/></NavLink>
                <NavLink to={"/applications"}><Button minimal icon="form" text="Eingehende Anträge" /></NavLink>
                <NavLink to={"/eak-generation"}><Button minimal icon="people" text="Karten erstellen"/></NavLink>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button minimal icon="log-out" text="Logout" onClick={props.onSignOut}/>
            </Navbar.Group>
        </Navbar>
    )
};

export default Navigation;
