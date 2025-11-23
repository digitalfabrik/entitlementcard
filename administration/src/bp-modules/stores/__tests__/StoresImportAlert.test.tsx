import { renderWithOptions } from '../../../testing/render'
import StoresImportAlert from '../StoresImportAlert'

const setDryRun = jest.fn()
describe('StoresImportAlert', () => {
  it('should show the correct alert information for dry run', () => {
    const { getByTestId, queryByTestId, getByText } = renderWithOptions(
      <StoresImportAlert dryRun setDryRun={setDryRun} storesCount={100} />,
      { translation: true }
    )
    const infoSpanElement = getByTestId('dry-run-alert')
    expect(infoSpanElement).toBeTruthy()
    expect(infoSpanElement.textContent).toBe(
      'Testlauf: In diesem Testlauf wird nur simuliert, wie viele Akzeptanzpartner geändert oder gelöscht werden würden. Es werden noch keine Änderungen an der Datenbank vorgenommen.'
    )
    expect(getByText('Testlauf:')).toBeTruthy()
    expect(
      getByText(
        'In diesem Testlauf wird nur simuliert, wie viele Akzeptanzpartner geändert oder gelöscht werden würden. Es werden noch keine Änderungen an der Datenbank vorgenommen.'
      )
    ).toBeTruthy()
    const durationSpanElement = queryByTestId('duration-alert')
    expect(durationSpanElement).toBeFalsy()
  })

  it('should show the correct alert information for production run', () => {
    const { getByTestId, queryByTestId } = renderWithOptions(
      <StoresImportAlert dryRun={false} setDryRun={setDryRun} storesCount={100} />,
      { translation: true }
    )
    const infoSpanElement = getByTestId('prod-run-alert')
    expect(infoSpanElement).toBeTruthy()
    expect(infoSpanElement.textContent).toBe(
      'Achtung: Akzeptanzpartner, welche aktuell in der Datenbank gespeichert, aber nicht in der Tabelle vorhanden sind, werden gelöscht!'
    )
    const durationSpanElement = queryByTestId('duration-alert')
    expect(durationSpanElement).toBeFalsy()
  })

  it('should show the correct alert information including approximate duration for production run', () => {
    const { getByTestId } = renderWithOptions(
      <StoresImportAlert dryRun={false} setDryRun={setDryRun} storesCount={10000} />,
      { translation: true }
    )
    const infoSpanElement = getByTestId('prod-run-alert')
    expect(infoSpanElement).toBeTruthy()
    expect(infoSpanElement.textContent).toBe(
      'Achtung: Akzeptanzpartner, welche aktuell in der Datenbank gespeichert, aber nicht in der Tabelle vorhanden sind, werden gelöscht!'
    )
    const durationSpanElement = getByTestId('duration-alert')
    expect(durationSpanElement).toBeTruthy()
    expect(durationSpanElement.textContent).toBe(
      'Geschätzte Dauer des Imports: 2 Minute(n). Bitte schließen sie das Browserfenster nicht!'
    )
  })
})
