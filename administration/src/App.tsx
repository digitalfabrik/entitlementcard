import React from 'react';
import Navigation from "./components/Navigation";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from '@apollo/client/link/context'
import {HashRouter, NavLink, Route, Routes} from "react-router-dom";
import GenerationController from "./components/generation/GenerationController";
import styled from "styled-components";
import RegionProvider from "./RegionProvider";
import AuthProvider, {AuthContext} from "./AuthProvider";
import Login from './components/auth/Login';
import KeepAliveToken from "./KeepAliveToken";
import ApplicationsController from "./components/applications/ApplicationsController";
import {Button, H3} from '@blueprintjs/core';
import {ProjectConfigProvider} from './project-configs/ProjectConfigContext';
import {MetaTagsManager} from "./components/MetaTagsManager";

if (!process.env.REACT_APP_API_BASE_URL) {
    throw new Error('REACT_APP_API_BASE_URL is not set!')
}

const httpLink = createHttpLink({
    uri: process.env.REACT_APP_API_BASE_URL
})

const createAuthLink = (token?: string) => setContext((_, {headers}) => ({
    headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ""
    }
}))

const createClient = (token?: string) => new ApolloClient({
    link: createAuthLink(token).concat(httpLink),
    cache: new InMemoryCache()
});

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const App = () => <ProjectConfigProvider>
    <MetaTagsManager>
        <AuthProvider>
            <AuthContext.Consumer>{([authData, onSignIn, onSignOut]) => (
                <ApolloProvider client={createClient(authData?.token)}>{
                    authData !== null && authData.expiry > new Date()
                        ? <KeepAliveToken authData={authData} onSignIn={onSignIn} onSignOut={onSignOut}>
                            <RegionProvider>
                                <HashRouter>
                                    <Navigation onSignOut={onSignOut}/>
                                    <Main>
                                        <Routes>
                                            <Route path={"/"} element={<div
                                                style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                                <H3>Wählen Sie eine Aktion aus:</H3>
                                                <NavLink to={"/applications"}><Button style={{marginBottom: '10px'}}
                                                                                      icon="form"
                                                                                      text="Eingehende Anträge"/></NavLink>
                                                <NavLink to={"/eak-generation"}><Button icon="people"
                                                                                        text="Karten erstellen"/></NavLink>
                                            </div>}/>
                                            <Route path={"/applications"}
                                                   element={<ApplicationsController token={authData.token}/>}/>
                                            <Route path={"/eak-generation"} element={<GenerationController/>}/>
                                        </Routes>
                                    </Main>
                                </HashRouter>
                            </RegionProvider>
                        </KeepAliveToken>
                        : <Login onSignIn={onSignIn}/>
                }</ApolloProvider>
            )}
            </AuthContext.Consumer>
        </AuthProvider>
    </MetaTagsManager>
</ProjectConfigProvider>

export default App;
