import React from 'react';
import Navigation from "./components/Navigation";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {HashRouter, Route} from "react-router-dom";
import GenerationController from "./components/generation/GenerationController";
import styled from "styled-components";

const client = new ApolloClient({
    uri: 'http://api.ehrenamtskarte.app/verification',
    cache: new InMemoryCache()
});

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`


function App() {
    return (
        <ApolloProvider client={client}>
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
        </ApolloProvider>
    );
}

export default App;
