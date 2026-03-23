import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
// TODO Use Temporal adapter, when it is available: https://github.com/mui/mui-x/issues/4399
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import React, { ReactElement } from 'react'

import Router from './Router'
import { getProjectConfig } from './project-configs'
import { AppSnackbarProvider } from './provider/AppSnackbarProvider'
import AuthProvider from './provider/AuthProvider'
import { ProjectConfigProvider } from './provider/ProjectConfigContext'
import UrqlClientProvider from './provider/UrqlClientProvider'
import './translations/i18n'
import { theme } from './util/theme'

if (!import.meta.env.BASE_URL) {
  throw new Error('BASE_URL is not set!')
}

const App = (): ReactElement => (
  <ProjectConfigProvider projectConfig={getProjectConfig(window.location.hostname)}>
    <ThemeProvider theme={theme(getProjectConfig(window.location.hostname))}>
      <CssBaseline />
      <AppSnackbarProvider>
        <AuthProvider>
          <UrqlClientProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Router />
            </LocalizationProvider>
          </UrqlClientProvider>
        </AuthProvider>
      </AppSnackbarProvider>
    </ThemeProvider>
  </ProjectConfigProvider>
)

export default App
