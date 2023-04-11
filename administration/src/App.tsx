import React from 'react'
import AuthProvider from './AuthProvider'
import { ProjectConfigProvider } from './project-configs/ProjectConfigContext'
import { AppToasterProvider } from './bp-modules/AppToaster'
import AppApolloProvider from './AppApolloProvider'
import Router from './Router'
import useMetaTags from './hooks/useMetaTags'

if (!process.env.REACT_APP_API_BASE_URL) {
  throw new Error('REACT_APP_API_BASE_URL is not set!')
}

const App = () => {
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
