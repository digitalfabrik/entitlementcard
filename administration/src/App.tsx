import React from 'react';
import './App.css';
import {Navigation} from "./components/Navigation";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
    uri: 'https://api.ehrenamtskarte.app',
    cache: new InMemoryCache()
});


function App() {
    return (
        <ApolloProvider client={client}>
            <div className="App">
                <Navigation/>
            </div>
        </ApolloProvider>
    );
}

export default App;
