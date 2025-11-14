import React from 'react'

import bayernConfig from '../../project-configs/bayern/config'
import { getCsvHeaders } from '../../project-configs/helper'
import koblenzConfig from '../../project-configs/koblenz/config'
import nuernbergConfig from '../../project-configs/nuernberg/config'
import showcaseConfig from '../../project-configs/showcase/config'
import { renderWithOptions } from '../../testing/render'
import ImportCardsRequirementsText from './ImportCardsRequirementsText'

describe('ImportCardsRequirementsText', () => {
  it('should show mandatory requirements with asterisks at Showcase', () => {
    const projectConfig = showcaseConfig
    const csvHeaders = getCsvHeaders(projectConfig)
    const { getByText } = renderWithOptions(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />,
      { projectConfig, translation: true }
    )
    expect(getByText('Spaltenformat: Name*, Ablaufdatum*, Kartentyp*')).toBeTruthy()
  })

  it('should show mandatory requirements with asterisks at Bayern', () => {
    const projectConfig = bayernConfig
    const csvHeaders = getCsvHeaders(projectConfig)
    const { getByText } = renderWithOptions(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />,
      { projectConfig, translation: true }
    )
    expect(getByText('Spaltenformat: Name*, Ablaufdatum*, Kartentyp*, MailNotification')).toBeTruthy()
  })

  it('should show mandatory requirements with asterisks at Nuernberg', () => {
    const projectConfig = nuernbergConfig
    const csvHeaders = getCsvHeaders(projectConfig)
    const { getByText } = renderWithOptions(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />,
      { projectConfig, translation: true }
    )
    expect(
      getByText(
        'Spaltenformat: Name*, Ablaufdatum*, Startdatum*, Geburtsdatum*, Pass-ID*, Adresszeile 1, Adresszeile 2, PLZ, Ort'
      )
    ).toBeTruthy()
  })

  it('should show mandatory requirements with asterisks at Koblenz', () => {
    const projectConfig = koblenzConfig
    const csvHeaders = getCsvHeaders(projectConfig)
    const { getByText } = renderWithOptions(
      <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={false} />,
      { projectConfig, translation: true }
    )
    expect(getByText('Spaltenformat: Name*, Ablaufdatum*, Geburtsdatum*, Referenznummer*')).toBeTruthy()
  })
})
