import { MockedProvider } from '@apollo/client/testing'
import { ThemeProvider, createTheme } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { RenderOptions, RenderResult, render as rawRender } from '@testing-library/react'
import React, { ReactElement, ReactNode, createElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'

import { ProjectConfig } from '../project-configs'
import { AppSnackbarProvider } from '../provider/AppSnackbarProvider'
import { ProjectConfigProvider } from '../provider/ProjectConfigContext'
import i18n from '../translations/i18n'

export type CustomRenderOptions = {
  projectConfig?: ProjectConfig
  theme?: boolean
  translation?: boolean
  router?: boolean
  localization?: boolean
  snackbar?: boolean
  apollo?: boolean
}

export const renderWithOptions = (
  ui: ReactElement,
  options: RenderOptions & CustomRenderOptions = {},
): RenderResult => {
  const {
    projectConfig,
    theme = false,
    translation = false,
    router = false,
    localization = false,
    snackbar = false,
    apollo = false,
    wrapper,
  } = options
  const wrappers: ((props: { children: ReactNode }) => ReactNode)[] = []
  if (wrapper) {
    wrappers.push((props: { children: ReactNode }) => createElement(wrapper, props, props.children))
  }
  if (theme) {
    wrappers.push(({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={createTheme({})}>{children}</ThemeProvider>
    ))
  }

  if (translation) {
    wrappers.push(({ children }: { children: ReactNode }) => (
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    ))
  }

  if (router) {
    wrappers.push(({ children }: { children: ReactNode }) => (
      <MemoryRouter>{children}</MemoryRouter>
    ))
  }

  if (localization) {
    wrappers.push(({ children }: { children: ReactNode }) => (
      <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
    ))
  }

  if (snackbar) {
    wrappers.push(({ children }: { children: ReactNode }) => (
      <AppSnackbarProvider>{children}</AppSnackbarProvider>
    ))
  }

  if (projectConfig) {
    wrappers.push(({ children }: { children: ReactNode }) => (
      <ProjectConfigProvider projectConfig={projectConfig}>{children}</ProjectConfigProvider>
    ))
  }

  if (apollo) {
    wrappers.push(({ children }: { children: ReactNode }) => (
      <MockedProvider>{children}</MockedProvider>
    ))
  }

  return rawRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <>{wrappers.reduce((acc, wrapper) => wrapper({ children: acc }), children)}</>
    ),
  })
}
