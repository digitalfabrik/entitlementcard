import './polyfills'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css'

import App from './App'
import reportWebVitals from './reportWebVitals'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
