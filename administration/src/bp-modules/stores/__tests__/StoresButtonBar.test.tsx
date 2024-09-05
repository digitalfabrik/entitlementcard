import { act, fireEvent, render } from '@testing-library/react'
import { ReactElement } from 'react'

import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import nuernbergConfig from '../../../project-configs/nuernberg/config'
import { AcceptingStoreEntry } from '../AcceptingStoreEntry'
import StoresButtonBar from '../StoresButtonBar'
import { invalidStoreData, validStoreData } from '../__mock__/mockStoreEntry'

jest.useFakeTimers()
jest.mock('csv-stringify/browser/esm/sync', () => ({
  stringify: jest.fn(),
}))

const goBack = jest.fn()
const importStores = jest.fn()
const wrapper = ({ children }: { children: ReactElement }) => <ProjectConfigProvider>{children}</ProjectConfigProvider>

describe('StoresButtonBar', () => {
  it('Should goBack when clicking back', async () => {
    const { getByText } = render(<StoresButtonBar goBack={goBack} acceptingStores={[]} importStores={importStores} />, {
      wrapper,
    })

    const backButton = getByText('Zurück zur Auswahl')
    expect(backButton).toBeTruthy()

    fireEvent.click(backButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350

    expect(goBack).toHaveBeenCalled()
  })

  it('Should disable import button for no stores', async () => {
    const { getByText } = render(<StoresButtonBar goBack={goBack} acceptingStores={[]} importStores={importStores} />, {
      wrapper,
    })

    const importButton = getByText('Import Stores').closest('button') as HTMLButtonElement
    expect(importButton).toBeTruthy()
    expect(importButton.disabled).toBeTruthy()

    fireEvent.mouseOver(importButton)
    fireEvent.click(importButton)
    await act(async () => {
      jest.advanceTimersByTime(100)
    })

    expect(getByText('Laden sie bitte eine Datei mit Akzeptanzpartnern hoch.')).toBeTruthy()
    expect(importStores).not.toHaveBeenCalled()
  })

  it('Should disable import stores for invalid store entries', async () => {
    const fields = nuernbergConfig.storeManagement.enabled ? nuernbergConfig.storeManagement.fields : []
    const stores = [new AcceptingStoreEntry(invalidStoreData, fields)]
    const { getByText } = render(
      <StoresButtonBar goBack={goBack} acceptingStores={stores} importStores={importStores} />,
      { wrapper }
    )

    const importButton = getByText('Import Stores').closest('button') as HTMLButtonElement
    expect(importButton).toBeTruthy()

    fireEvent.mouseOver(importButton)
    fireEvent.click(importButton)

    await act(async () => {
      jest.advanceTimersByTime(100)
    })

    expect(importButton.disabled).toBeTruthy()
    expect(getByText('Fehlerhafte Einträge. Bitte prüfen sie die rot markierten Felder.')).toBeTruthy()
    expect(importStores).not.toHaveBeenCalled()
  })

  it('Should import valid stores', async () => {
    const fields = nuernbergConfig.storeManagement.enabled ? nuernbergConfig.storeManagement.fields : []
    const stores = [new AcceptingStoreEntry(validStoreData, fields)]
    const { getByText } = render(
      <StoresButtonBar goBack={goBack} acceptingStores={stores} importStores={importStores} />,
      { wrapper }
    )

    const importButton = getByText('Import Stores').closest('button') as HTMLButtonElement
    expect(importButton).toBeTruthy()

    fireEvent.click(importButton)
    await act(async () => null) // Popper update() - https://github.com/popperjs/react-popper/issues/350

    expect(importStores).toHaveBeenCalled()
  })
})
