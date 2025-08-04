import { OverlayToaster } from '@blueprintjs/core'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fireEvent } from '@testing-library/react'
import React, { ReactNode, act } from 'react'
import { MemoryRouter } from 'react-router'

import { initializeCardFromCSV } from '../../../cards/Card'
import FormAlert from '../../../mui-modules/base/FormAlert'
import koblenzConfig from '../../../project-configs/koblenz/config'
import { renderWithTranslation } from '../../../testing/render'
import { AppToasterProvider } from '../../AppToaster'
import CardSelfServiceForm from '../CardSelfServiceForm'
import { exampleCard } from '../__mock__/mockSelfServiceCard'
import { DataPrivacyAcceptingStatus } from '../constants'

const wrapper = ({ children }: { children: ReactNode }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <MemoryRouter>
      <AppToasterProvider>{children}</AppToasterProvider>
    </MemoryRouter>
  </LocalizationProvider>
)

const setDataPrivacyAccepted = jest.fn()
const updateCard = jest.fn()
const generateCards = jest.fn()
describe('CardSelfServiceForm', () => {
  it('should display all elements in initial state', () => {
    const { getByLabelText, getByPlaceholderText, getByText, getByRole } = renderWithTranslation(
      <CardSelfServiceForm
        updateCard={updateCard}
        generateCards={generateCards}
        card={initializeCardFromCSV(koblenzConfig.card, [], [], undefined, true)}
        dataPrivacyAccepted={DataPrivacyAcceptingStatus.untouched}
        setDataPrivacyAccepted={setDataPrivacyAccepted}
      />,
      { wrapper, projectConfig: koblenzConfig }
    )

    expect(getByLabelText('Vorname Name').closest('input')).toBeTruthy()
    expect(getByPlaceholderText('Erika Musterfrau')).toBeTruthy()
    expect(getByPlaceholderText('5.031.025.281, 000D000001, 91459')).toBeTruthy()
    expect(getByLabelText('Aktenzeichen').closest('input')).toBeTruthy()
    expect(getByPlaceholderText('TT.MM.JJJJ')).toBeTruthy()
    const dataPrivacyCheckbox = getByRole('checkbox')
    expect(dataPrivacyCheckbox).toBeTruthy()
    expect(dataPrivacyCheckbox.getAttribute('checked')).toBeNull()
    expect(getByText('Wo finde ich das Aktenzeichen?')).toBeTruthy()
    const createPassButton = getByText('KoblenzPass erstellen')
    expect(createPassButton).toBeTruthy()
    expect(createPassButton).toBeEnabled()
  })

  it('should show an error message if card creation button is pressed without needed information', async () => {
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')
    const { getByText } = renderWithTranslation(
      <CardSelfServiceForm
        updateCard={updateCard}
        generateCards={generateCards}
        card={initializeCardFromCSV(koblenzConfig.card, [], [], undefined, true)}
        dataPrivacyAccepted={DataPrivacyAcceptingStatus.accepted}
        setDataPrivacyAccepted={setDataPrivacyAccepted}
      />,
      { wrapper, projectConfig: koblenzConfig }
    )

    const createPassButton = getByText('KoblenzPass erstellen')
    expect(createPassButton).toBeTruthy()
    expect(createPassButton).toBeEnabled()
    await act(async () => {
      fireEvent.click(createPassButton)
    })
    expect(toasterSpy).toHaveBeenCalledWith({
      intent: 'danger',
      message: <FormAlert isToast errorMessage='Mindestens eine Ihrer Angaben ist ungültig.' />,
    })
  })

  it('should not show an error message if all fields are filled correctly', async () => {
    const toasterSpy = jest.spyOn(OverlayToaster.prototype, 'show')
    const { getByText } = renderWithTranslation(
      <CardSelfServiceForm
        updateCard={updateCard}
        generateCards={generateCards}
        card={exampleCard}
        dataPrivacyAccepted={DataPrivacyAcceptingStatus.accepted}
        setDataPrivacyAccepted={setDataPrivacyAccepted}
      />,
      { wrapper, projectConfig: koblenzConfig }
    )

    const createPassButton = getByText('KoblenzPass erstellen')
    expect(createPassButton).toBeTruthy()
    expect(createPassButton).toBeEnabled()
    await act(async () => {
      fireEvent.click(createPassButton)
    })
    expect(toasterSpy).not.toHaveBeenCalled()
  })
})
