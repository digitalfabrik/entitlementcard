import React from 'react';
import './App.css';
import {Navigation} from "./components/Navigation";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

function App() {
  return (
    <div className="App">
      <Navigation />
    </div>
  );
}

export default App;
