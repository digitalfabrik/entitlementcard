import { OverlayToaster } from '@blueprintjs/core'
import { fireEvent, render, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'

import { Card, initializeCard } from '../../cards/Card'
import { Region } from '../../generated/graphql'
import { ProjectConfigProvider } from '../../project-configs/ProjectConfigContext'
import bayernConfig from '../../project-configs/bayern/config'
import { LOCAL_STORAGE_PROJECT_KEY } from '../../project-configs/constants'
import { ProjectConfig } from '../../project-configs/getProjectConfig'
import { getCsvHeaders } from '../../project-configs/helper'
import nuernbergConfig from '../../project-configs/nuernberg/config'
import { AppToasterProvider } from '../AppToaster'
import ImportCardsInput, { ENTRY_LIMIT } from './ImportCardsInput'

jest.mock('../../Router', () => ({}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <AppToasterProvider>
    <ProjectConfigProvider>{children}</ProjectConfigProvider>
  </AppToasterProvider>
)

describe('ImportCardsInput', () => {
  const region: Region = {
    id: 0,
    name: 'augsburg',
    prefix: 'a',
    activatedForApplication: true,
    activatedForCardConfirmationMail: true,
  }

  const renderAndSubmitCardsInput = async (
    projectConfig: ProjectConfig,
    csv: string,
    lineToCard: () => Card,
    setCards: () => void
  ) => {
    const fileReaderMock = {
      // eslint-disable-next-line func-names
      readAsText: jest.fn(function (this: FileReader, _: Blob) {
        this.onloadend!({ target: { result: csv } } as ProgressEvent<FileReader>)
      }),
    } as unknown as FileReader
    jest.spyOn(global, 'FileReader').mockReturnValue(fileReaderMock)
    const file = new File([csv], `${projectConfig.name}.csv`, { type: 'text/csv' })

    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, projectConfig.projectId)

    const { getByTestId } = render(
      <ImportCardsInput
        headers={getCsvHeaders(projectConfig)}
        lineToCard={lineToCard}
        setCards={setCards}
        isFreinetFormat={false}
      />,
      { wrapper }
    )

    const fileInput = getByTestId('file-upload') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    fireEvent.input(fileInput)

    await waitFor(() => expect(fileReaderMock.readAsText).toHaveBeenCalledTimes(1))
  }

  it.each([
    {
      projectConfig: bayernConfig,
      csv: `
Name,Ablaufdatum,Kartentyp
Thea Test,03.04.2024,Standard
Tilo Traber,,Gold
`,
    },
    {
      projectConfig: nuernbergConfig,
      csv: `
Name,Ablaufdatum,Geburtsdatum,Passnummer
Thea Test,03.04.2024,10.10.2000,12345678
Tilo Traber,03.04.2025,12.01.1984,98765432
`,
    },
  ])(`Correctly import CSV Card for project $projectConfig.name`, async ({ projectConfig, csv }) => {
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
    const lineToCard = jest.fn(() => initializeCard(projectConfig.card, region))
    const setCards = jest.fn()

    await renderAndSubmitCardsInput(projectConfig, csv, lineToCard, setCards)

    expect(toaster).not.toHaveBeenCalled()
    expect(setCards).toHaveBeenCalledTimes(1)
    expect(lineToCard).toHaveBeenCalledTimes(2)
  })

  it.each([
    {
      csv: '',
      error: 'Die gewählte Datei ist leer.',
    },
    {
      csv: 'Name,Ablaufdatum,Kartentyp',
      error: 'Die Datei muss mindestens einen Eintrag enthalten.',
    },
    {
      csv: `
  Name,Ablaufdatum,Kartentyp
  Thea Test,03.04.2024,Standard
  Tilo Traber,,,Gold
  `,
      error: 'Keine gültige CSV Datei. Nicht jede Reihe enthält gleich viele Elemente.',
    },
    {
      csv: `
Name,Ablaufdatum,Passnummer
${'Thea Test,03.04.2024,12345678\n'.repeat(ENTRY_LIMIT + 1)}
  `,
      error: `Die Datei hat mehr als ${ENTRY_LIMIT} Einträge.`,
    },
  ])(`Import CSV Card should fail with error '$error'`, async ({ csv, error }) => {
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
    const lineToCard = jest.fn(() => initializeCard(bayernConfig.card, region))
    const setCards = jest.fn()

    await renderAndSubmitCardsInput(bayernConfig, csv, lineToCard, setCards)

    expect(toaster).toHaveBeenCalledWith({ intent: 'danger', message: error })
    expect(setCards).not.toHaveBeenCalled()
    expect(lineToCard).not.toHaveBeenCalled()
  })
})
