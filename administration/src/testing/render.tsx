import { RenderOptions, RenderResult, render as rawRender } from '@testing-library/react'
import React, { ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'

import i18n from '../i18n'
import { ProjectConfigProvider } from '../project-configs/ProjectConfigContext'
import { ProjectConfig } from '../project-configs/getProjectConfig'
import showcaseConfig from '../project-configs/showcase/config'

export const renderWithRouter = (ui: ReactElement, options?: RenderOptions): RenderResult => {
  const CustomWrapper = options?.wrapper
  const wrapper = CustomWrapper
    ? (props: { children: ReactNode }) => (
        <MemoryRouter>
          <CustomWrapper {...props} />
        </MemoryRouter>
      )
    : MemoryRouter
  return rawRender(ui, { wrapper })
}

type CustomRenderOptions = {
  projectConfig?: ProjectConfig
}

export const renderWithTranslation = (
  ui: ReactElement,
  options?: RenderOptions & CustomRenderOptions
): RenderResult => {
  const CustomWrapper = options?.wrapper
  const projectConfig = options?.projectConfig ?? showcaseConfig

  const wrapper = (props: { children: ReactNode }) => (
    <ProjectConfigProvider projectConfig={projectConfig}>
      <I18nextProvider i18n={i18n}>{CustomWrapper ? <CustomWrapper {...props} /> : props.children}</I18nextProvider>
    </ProjectConfigProvider>
  )

  return rawRender(ui, { wrapper })
}
