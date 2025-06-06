import { ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import React, { ReactElement } from 'react'

import AppApolloProvider from './AppApolloProvider'
import AuthProvider from './AuthProvider'
import Router from './Router'
import { AppToasterProvider } from './bp-modules/AppToaster'
import './i18n'
import { theme } from './mui-modules/theme'
import { ProjectConfigProvider } from './project-configs/ProjectConfigContext'
import getProjectConfig from './project-configs/getProjectConfig'

if (!process.env.REACT_APP_API_BASE_URL) {
  throw new Error('REACT_APP_API_BASE_URL is not set!')
}

const App = (): ReactElement => (
  <ProjectConfigProvider projectConfig={getProjectConfig(window.location.hostname)}>
    <AppToasterProvider>
      <AuthProvider>
        <AppApolloProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              <Router />
            </ThemeProvider>
          </LocalizationProvider>
        </AppApolloProvider>
      </AuthProvider>
    </AppToasterProvider>
  </ProjectConfigProvider>
)

export default App
