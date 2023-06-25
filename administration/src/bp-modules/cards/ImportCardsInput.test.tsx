import { OverlayToaster } from '@blueprintjs/core'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { ReactElement } from 'react'

import CSVCard from '../../cards/CSVCard'
import { Region } from '../../generated/graphql'
import { ProjectConfigProvider } from '../../project-configs/ProjectConfigContext'
import bayernConfig from '../../project-configs/bayern/config'
import { ProjectConfig } from '../../project-configs/getProjectConfig'
import nuernbergConfig from '../../project-configs/nuernberg/config'
import { AppToasterProvider } from '../AppToaster'
import { getHeaders } from './ImportCardsController'
import ImportCardsInput, { ENTRY_LIMIT } from './ImportCardsInput'

const wrapper = ({ children }: { children: ReactElement }) => (
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
  }

  var readAsTextSpy: jasmine.Spy

  beforeEach(() => {
    readAsTextSpy = jasmine.createSpy()
    const fileReaderMock = {
      readAsText: readAsTextSpy,
    } as unknown as FileReader
    spyOn(global, 'FileReader').and.returnValue(fileReaderMock)
  })

  const renderAndSubmitCardsInput = async (
    projectConfig: ProjectConfig,
    csv: string,
    lineToBlueprint: () => CSVCard,
    setCardBlueprints: () => void
  ) => {
    const file = new File([csv], projectConfig.name + '.csv', { type: 'text/csv' })
    readAsTextSpy.and.callFake(function (this: FileReader, _: Blob) {
      this.onloadend!({ target: { result: csv } } as ProgressEvent<FileReader>)
    })

    localStorage.setItem('project-override', projectConfig.projectId)

    const { getByTestId } = render(
      <ImportCardsInput
        headers={getHeaders(projectConfig)}
        lineToBlueprint={lineToBlueprint}
        setCardBlueprints={setCardBlueprints}
      />,
      { wrapper }
    )

    const fileInput = getByTestId('file-upload') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    await act(async () => {
      fireEvent.input(fileInput)
      await waitFor(() => expect(readAsTextSpy).toHaveBeenCalledTimes(1))
    })
  }

  ;[
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
  ].forEach(({ projectConfig, csv }) => {
    it(`Correctly import CSV Card for project ${projectConfig.name}`, async () => {
      const toasterSpy = spyOn(OverlayToaster.prototype, 'show')
      const lineToBlueprintSpy = jasmine.createSpy().and.callFake(() => new CSVCard(projectConfig.card, region))
      const setCardBlueprintsSpy = jasmine.createSpy()

      await renderAndSubmitCardsInput(projectConfig, csv, lineToBlueprintSpy, setCardBlueprintsSpy)

      expect(toasterSpy).not.toHaveBeenCalled()
      expect(setCardBlueprintsSpy).toHaveBeenCalledTimes(1)
      expect(lineToBlueprintSpy).toHaveBeenCalledTimes(2)
    })
  })
  ;[
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
Name,Ablaufdatum,Geburtsdatum,Passnummer
${'Thea Test,03.04.2024,10.10.2000,12345678\n'.repeat(ENTRY_LIMIT + 1)}
`,
      error: `Die Datei hat mehr als ${ENTRY_LIMIT} Einträge.`,
    },
  ].forEach(({ csv, error }) => {
    it(`Import CSV Card should fail with error '$error'`, async () => {
      const toasterSpy = spyOn(OverlayToaster.prototype, 'show')
      const lineToBlueprintSpy = jasmine.createSpy().and.callFake(() => new CSVCard(bayernConfig.card, region))
      const setCardBlueprintsSpy = jasmine.createSpy()

      await renderAndSubmitCardsInput(bayernConfig, csv, lineToBlueprintSpy, setCardBlueprintsSpy)

      expect(toasterSpy).toHaveBeenCalledWith({ intent: 'danger', message: error })
      expect(setCardBlueprintsSpy).not.toHaveBeenCalled()
      expect(lineToBlueprintSpy).not.toHaveBeenCalled()
    })
  })
})
