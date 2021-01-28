import React from 'react';
import Navigation from "./components/Navigation";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import PDFView from "./components/PDFView";
import {HashRouter, Route} from "react-router-dom";
import EakGeneration from "./components/generation/EakGeneration";
import {createBinaryData} from "./util/protobuf";
import {CardActivateModel} from "./generated/compiled";

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
                        <PDFView />
                        
                        <button onClick={() => console.log(createBinaryData("Max Mustermann", 1, {months: 5}, CardActivateModel.CardType.STANDARD))}>Binary</button>
                    </Route>
                    <Route path={"/accepting-stores"}>

                    </Route>
                </div>
            </HashRouter>
        </ApolloProvider>
    );
}

export default App;
