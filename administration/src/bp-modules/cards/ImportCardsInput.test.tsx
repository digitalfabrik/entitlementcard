import { OverlayToaster } from '@blueprintjs/core'
import { fireEvent, waitFor } from '@testing-library/react'
import React from 'react'

import { BAVARIA_CARD_TYPE_GOLD, BAVARIA_CARD_TYPE_STANDARD } from '../../cards/extensions/BavariaCardTypeExtension'
import { Region } from '../../generated/graphql'
import { ProjectConfigProvider } from '../../project-configs/ProjectConfigContext'
import bayernConfig from '../../project-configs/bayern/config'
import { ProjectConfig, setProjectConfigOverride } from '../../project-configs/getProjectConfig'
import koblenzConfig from '../../project-configs/koblenz/config'
import nuernbergConfig from '../../project-configs/nuernberg/config'
import { renderWithRouter } from '../../testing/render'
import PlainDate from '../../util/PlainDate'
import { AppToasterProvider } from '../AppToaster'
import ImportCardsInput, { ENTRY_LIMIT } from './ImportCardsInput'

jest.mock('../../Router', () => ({}))

describe('ImportCardsInput', () => {
  beforeEach(jest.clearAllMocks)

  const region: Region = {
    id: 0,
    name: 'augsburg',
    prefix: 'a',
    activatedForApplication: true,
    activatedForCardConfirmationMail: true,
  }

  const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
  const setCards = jest.fn()

  const renderAndSubmitCardsInput = async (projectConfig: ProjectConfig, csv: string, setCards: () => void) => {
    const fileReaderMock = {
      // eslint-disable-next-line func-names
      readAsText: jest.fn(function (this: FileReader, _: Blob) {
        this.onloadend!({ target: { result: csv } } as ProgressEvent<FileReader>)
      }),
    } as unknown as FileReader
    jest.spyOn(global, 'FileReader').mockReturnValue(fileReaderMock)
    const file = new File([csv], `${projectConfig.name}.csv`, { type: 'text/csv' })
    setProjectConfigOverride(projectConfig.projectId)

    const { getByTestId } = renderWithRouter(
      <AppToasterProvider>
        <ProjectConfigProvider>
          <ImportCardsInput setCards={setCards} region={region} />
        </ProjectConfigProvider>
      </AppToasterProvider>
    )

    const fileInput = getByTestId('file-upload') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    fireEvent.input(fileInput)

    await waitFor(() => expect(fileReaderMock.readAsText).toHaveBeenCalledTimes(1))
  }

  it('should correctly import CSV Card for bayern', async () => {
    const projectConfig = bayernConfig
    const csv = `
Name,Ablaufdatum,Kartentyp
Thea Test,03.04.2024,Standard
Tilo Traber,,gold
`
    await renderAndSubmitCardsInput(projectConfig, csv, setCards)

    expect(toaster).not.toHaveBeenCalled()
    expect(setCards).toHaveBeenCalledTimes(1)
    expect(setCards).toHaveBeenCalledWith([
      {
        expirationDate: PlainDate.fromCustomFormat('03.04.2024'),
        extensions: { bavariaCardType: BAVARIA_CARD_TYPE_STANDARD, regionId: 0 },
        fullName: 'Thea Test',
        id: expect.any(Number),
      },
      {
        expirationDate: null,
        extensions: { regionId: 0, bavariaCardType: BAVARIA_CARD_TYPE_GOLD },
        fullName: 'Tilo Traber',
        id: expect.any(Number),
      },
    ])
  })

  it('should correctly import CSV Card for bayern freinet', async () => {
    jest.spyOn(URLSearchParams.prototype, 'get').mockReturnValue('true')

    const projectConfig = bayernConfig
    const csv = `
inhaber_ehrenamtskarte;eak_datum;eak_karten_status;co_name;anrede;titel;vorname;nachname;strasse;plz;ort
�Blau�;01.12.2029;Karte abgelaufen;;Herr;;Maxim;Musterin;Kirchgasse 30;97346;Iphofen
�Gold�;;Karte an EA verschickt;;Herr;;Max;Muster;Kleinlangheimer Stra�e 12;97355;Kleinlangheim
`
    await renderAndSubmitCardsInput(projectConfig, csv, setCards)

    expect(toaster).not.toHaveBeenCalled()
    expect(setCards).toHaveBeenCalledTimes(1)
    expect(setCards).toHaveBeenCalledWith([
      {
        expirationDate: PlainDate.fromCustomFormat('01.12.2029'),
        extensions: { bavariaCardType: BAVARIA_CARD_TYPE_STANDARD, regionId: 0 },
        fullName: 'Maxim Musterin',
        id: expect.any(Number),
      },
      {
        expirationDate: null,
        extensions: { regionId: 0, bavariaCardType: BAVARIA_CARD_TYPE_GOLD },
        fullName: 'Max Muster',
        id: expect.any(Number),
      },
    ])
  })

  it('should correctly import CSV Card for nuernberg', async () => {
    const projectConfig = nuernbergConfig
    const csv = `
Name,Ablaufdatum,Startdatum,Geburtsdatum,Pass-ID
Thea Test,03.04.2024,01.01.2026,10.10.2000,12345678
Tilo Traber,03.04.2025,01.01.2026,12.01.1984,98765432
`

    await renderAndSubmitCardsInput(projectConfig, csv, setCards)

    expect(toaster).not.toHaveBeenCalled()
    expect(setCards).toHaveBeenCalledTimes(1)
    expect(setCards).toHaveBeenCalledWith([
      {
        expirationDate: PlainDate.fromCustomFormat('03.04.2024'),
        extensions: {
          birthday: PlainDate.fromCustomFormat('10.10.2000'),
          regionId: 0,
          nuernbergPassId: 12345678,
          startDay: PlainDate.fromCustomFormat('01.01.2026'),
        },
        fullName: 'Thea Test',
        id: expect.any(Number),
      },
      {
        expirationDate: PlainDate.fromCustomFormat('03.04.2025'),
        extensions: {
          birthday: PlainDate.fromCustomFormat('12.01.1984'),
          regionId: 0,
          nuernbergPassId: 98765432,
          startDay: PlainDate.fromCustomFormat('01.01.2026'),
        },
        fullName: 'Tilo Traber',
        id: expect.any(Number),
      },
    ])
  })

  it('should correctly import CSV Card for koblenz', async () => {
    const projectConfig = koblenzConfig
    const csv = `
Name,Ablaufdatum,Geburtsdatum,Referenznummer
Thea Test,03.04.2024,10.10.2000,123k
Tilo Traber,03.04.2025,12.01.1984,98765432
`

    await renderAndSubmitCardsInput(projectConfig, csv, setCards)

    expect(toaster).not.toHaveBeenCalled()
    expect(setCards).toHaveBeenCalledTimes(1)
    expect(setCards).toHaveBeenCalledWith([
      {
        expirationDate: PlainDate.fromCustomFormat('03.04.2024'),
        extensions: {
          birthday: PlainDate.fromCustomFormat('10.10.2000'),
          regionId: 0,
          koblenzReferenceNumber: '123k',
        },
        fullName: 'Thea Test',
        id: expect.any(Number),
      },
      {
        expirationDate: PlainDate.fromCustomFormat('03.04.2025'),
        extensions: {
          birthday: PlainDate.fromCustomFormat('12.01.1984'),
          regionId: 0,
          koblenzReferenceNumber: '98765432',
        },
        fullName: 'Tilo Traber',
        id: expect.any(Number),
      },
    ])
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
  ])(`import CSV Card should fail with error '$error'`, async ({ csv, error }) => {
    const toaster = jest.spyOn(OverlayToaster.prototype, 'show')
    const setCards = jest.fn()

    await renderAndSubmitCardsInput(bayernConfig, csv, setCards)

    expect(toaster).toHaveBeenCalledWith({ intent: 'danger', message: error })
    expect(setCards).not.toHaveBeenCalled()
  })
})
