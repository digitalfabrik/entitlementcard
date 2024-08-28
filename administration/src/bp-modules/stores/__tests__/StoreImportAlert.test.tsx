import { render } from '@testing-library/react'
import { ReactElement } from 'react'

import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import StoresImportAlert from '../StoresImportAlert'

const wrapper = ({ children }: { children: ReactElement }) => <ProjectConfigProvider>{children}</ProjectConfigProvider>

const setDryRun = jest.fn()
describe('StoreImportAlert', () => {
  it('should show the correct alert information for dry run', () => {
    const { getByTestId } = render(<StoresImportAlert dryRun setDryRun={setDryRun} />, {
      wrapper,
    })
    const infoSpanElement = getByTestId('dry-run-alert')
    expect(infoSpanElement).toBeTruthy()
    expect(infoSpanElement.textContent).toBe(
      'Testlauf: In diesem Testlauf wird nur simuliert, wie viele Stores geupdated oder gelöscht werden würden. Es werden keine Daten in die Datenbank geschrieben.'
    )
  })

  it('should show the correct alert information for production run', () => {
    const { getByTestId } = render(<StoresImportAlert dryRun={false} setDryRun={setDryRun} />, {
      wrapper,
    })
    const infoSpanElement = getByTestId('prod-run-alert')
    expect(infoSpanElement).toBeTruthy()
    expect(infoSpanElement.textContent).toBe(
      'Achtung: Akzeptanzpartner, welche aktuell in der Datenbank gespeichert, aber nicht in der Tabelle vorhanden sind, werden gelöscht!'
    )
  })
})
