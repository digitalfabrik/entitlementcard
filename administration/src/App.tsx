import React from 'react'
import AuthProvider from './AuthProvider'
import { ProjectConfigProvider } from './project-configs/ProjectConfigContext'
import MetaTagsManager from './components/MetaTagsManager'
import { AppToasterProvider } from './components/AppToaster'
import AppApolloProvider from './AppApolloProvider'
import Router from './Router'

if (!process.env.REACT_APP_API_BASE_URL) {
  throw new Error('REACT_APP_API_BASE_URL is not set!')
}

const App = () => (
  <ProjectConfigProvider>
    <MetaTagsManager />
    <AppToasterProvider>
      <AuthProvider>
        <AppApolloProvider>
          <Router />
        </AppApolloProvider>
      </AuthProvider>
    </AppToasterProvider>
  </ProjectConfigProvider>
)

export default App
