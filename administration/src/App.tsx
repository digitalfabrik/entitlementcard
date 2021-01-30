import React from 'react';
import Navigation from "./components/Navigation";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {HashRouter, Route} from "react-router-dom";
import GenerationController from "./components/generation/GenerationController";

const client = new ApolloClient({
    uri: 'https://api.ehrenamtskarte.app/verification',
    cache: new InMemoryCache()
});


function App() {
    return (
        <ApolloProvider client={client}>
            <HashRouter>
                <div className="App">
                    <Navigation/>
                </div>
                <div className="main">
                    <Route exact path={"/"}>

                    </Route>
                    <Route path={"/eak-generation"}>
                        <GenerationController/>
                    </Route>
                    <Route path={"/accepting-stores"}>

                    </Route>
                </div>
            </HashRouter>
        </ApolloProvider>
    );
}

export default App;
