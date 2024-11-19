import React, { ReactElement } from 'react'

import AppApolloProvider from './AppApolloProvider'
import AuthProvider from './AuthProvider'
import Router from './Router'
import { AppToasterProvider } from './bp-modules/AppToaster'
import useMetaTags from './hooks/useMetaTags'
import './i18n'
import { ProjectConfigProvider } from './project-configs/ProjectConfigContext'

if (!process.env.REACT_APP_API_BASE_URL) {
  throw new Error('REACT_APP_API_BASE_URL is not set!')
}

const App = (): ReactElement => {
  useMetaTags()

  return (
    <ProjectConfigProvider>
      <AppToasterProvider>
        <AuthProvider>
          <AppApolloProvider>
            <Router />
          </AppApolloProvider>
        </AuthProvider>
      </AppToasterProvider>
    </ProjectConfigProvider>
  )
}

export default App
