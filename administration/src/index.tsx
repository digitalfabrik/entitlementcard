import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css'

import App from './App'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
