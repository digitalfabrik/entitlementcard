import React from 'react';
import Navigation from "./components/Navigation";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {HashRouter, Route} from "react-router-dom";
import GenerationController from "./components/generation/GenerationController";
import styled from "styled-components";
import RegionIdProvider from "./RegionIdProvider";

const client = new ApolloClient({
    uri: 'https://api.ehrenamtskarte.app',
    cache: new InMemoryCache()
});

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`


const App = () =>
    <ApolloProvider client={client}>
        <RegionIdProvider>
            <HashRouter>
                <Navigation/>
                <Main>
                    <Route exact path={"/"}>

                    </Route>
                    <Route path={"/eak-generation"}>
                        <GenerationController/>
                    </Route>
                    <Route path={"/accepting-stores"}>

                    </Route>
                </Main>
            </HashRouter>
        </RegionIdProvider>
    </ApolloProvider>

export default App;
