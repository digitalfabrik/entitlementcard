import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'normalize.css'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './index.css'
import initSentry from './util/initSentry'

if (process.env.REACT_APP_IS_PRODUCTION === "true") {
  initSentry()
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
