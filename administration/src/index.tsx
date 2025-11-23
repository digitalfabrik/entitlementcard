import 'normalize.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { isProductionEnvironment } from './util/helper'
import { initSentry } from './util/sentry'

if (isProductionEnvironment()) {
  initSentry()
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
