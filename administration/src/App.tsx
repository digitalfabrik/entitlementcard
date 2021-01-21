import React from 'react';
import Navigation from "./components/Navigation";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import PDFView from "./components/generation/PDFView";
import {HashRouter, Route} from "react-router-dom";
import EakGeneration from "./components/generation/EakGeneration";

const client = new ApolloClient({
    uri: 'https://api.ehrenamtskarte.app',
    cache: new InMemoryCache()
});


function App() {
    return (
        <ApolloProvider client={client}>
            <HashRouter>
                <div className="App">
                    <Navigation />
                </div>
                <div className="main">
                    <Route exact path={"/"}>

                    </Route>
                    <Route path={"/eak-generation"}>
                        <EakGeneration />
                    </Route>
                    <Route path={"/accepting-stores"}>

                    </Route>
                </div>
            </HashRouter>
        </ApolloProvider>
    );
}

export default App;
