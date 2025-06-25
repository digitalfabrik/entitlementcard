import React from 'react'

import bayernConfig from '../../project-configs/bayern/config'
import { getCsvHeaders } from '../../project-configs/helper'
import koblenzConfig from '../../project-configs/koblenz/config'
import nuernbergConfig from '../../project-configs/nuernberg/config'
import showcaseConfig from '../../project-configs/showcase/config'
import { renderWithTranslation } from '../../testing/render'
import ImportCardsRequirementsText, { getRequiredHeaders } from './ImportCardsRequirementsText'

describe('ImportCardsRequirementsText', () => {
  it('should show mandatory requirements with asterisks at Showcase', () => {
    const projectConfig = showcaseConfig
    const csvHeaders = getCsvHeaders(projectConfig)
    const { getByText } = renderWithTranslation(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />,
      { projectConfig }
    )
    const requiredHeaders = getRequiredHeaders(projectConfig)
    const decoratedHeaders = csvHeaders.map(header => (requiredHeaders.includes(header) ? `${header}*` : header))
    expect(getByText(`Spaltenformat: ${decoratedHeaders.join(', ')}`)).toBeTruthy()
  })

  it('should show mandatory requirements with asterisks at Bayern', () => {
    const projectConfig = bayernConfig
    const csvHeaders = getCsvHeaders(projectConfig)
    const { getByText } = renderWithTranslation(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />,
      { projectConfig }
    )
    const requiredHeaders = getRequiredHeaders(projectConfig)
    const decoratedHeaders = csvHeaders.map(header => (requiredHeaders.includes(header) ? `${header}*` : header))
    expect(getByText(`Spaltenformat: ${decoratedHeaders.join(', ')}`)).toBeTruthy()
  })

  it('should show mandatory requirements with asterisks at Nuernberg', () => {
    const projectConfig = nuernbergConfig
    const csvHeaders = getCsvHeaders(projectConfig)
    const { getByText } = renderWithTranslation(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />,
      { projectConfig }
    )
    const requiredHeaders = getRequiredHeaders(projectConfig)
    const decoratedHeaders = csvHeaders.map(header => (requiredHeaders.includes(header) ? `${header}*` : header))
    expect(getByText(`Spaltenformat: ${decoratedHeaders.join(', ')}`)).toBeTruthy()
  })

  it('should show mandatory requirements with asterisks at Koblenz', () => {
    const projectConfig = koblenzConfig
    const csvHeaders = getCsvHeaders(projectConfig)
    const { getByText } = renderWithTranslation(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />,
      { projectConfig }
    )
    const requiredHeaders = getRequiredHeaders(projectConfig)
    const decoratedHeaders = csvHeaders.map(header => (requiredHeaders.includes(header) ? `${header}*` : header))
    expect(getByText(`Spaltenformat: ${decoratedHeaders.join(', ')}`)).toBeTruthy()
  })
})
