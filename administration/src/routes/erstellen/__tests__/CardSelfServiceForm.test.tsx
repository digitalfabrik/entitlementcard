import { fireEvent } from '@testing-library/react'
import React, { act } from 'react'

import { initializeCardFromCSV } from '../../../cards/Card'
import koblenzConfig from '../../../project-configs/koblenz/config'
import FormAlert from '../../../shared/components/FormAlert'
import { CustomRenderOptions, renderWithOptions } from '../../../testing/render'
import { exampleCard } from '../__mock__/mockSelfServiceCard'
import CardSelfServiceForm from '../components/CardSelfServiceForm'
import { DataPrivacyAcceptingStatus } from '../constants'

const enqueueSnackbarMock = jest.fn()
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: enqueueSnackbarMock,
  }),
}))

const mockProvider: CustomRenderOptions = {
  projectConfig: koblenzConfig,
  localization: true,
  translation: true,
  router: true,
  snackbar: true,
}

const setDataPrivacyAccepted = jest.fn()
const updateCard = jest.fn()
const generateCards = jest.fn()
describe('CardSelfServiceForm', () => {
  beforeEach(jest.resetAllMocks)

  it('should display all elements in initial state', () => {
    const { getByLabelText, getByPlaceholderText, getByText, getByRole } = renderWithOptions(
      <CardSelfServiceForm
        updateCard={updateCard}
        generateCards={generateCards}
        card={initializeCardFromCSV(koblenzConfig.card, [], [], undefined, true)}
        dataPrivacyAccepted={DataPrivacyAcceptingStatus.untouched}
        setDataPrivacyAccepted={setDataPrivacyAccepted}
      />,
      mockProvider
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
    const { getByText } = renderWithOptions(
      <CardSelfServiceForm
        updateCard={updateCard}
        generateCards={generateCards}
        card={initializeCardFromCSV(koblenzConfig.card, [], [], undefined, true)}
        dataPrivacyAccepted={DataPrivacyAcceptingStatus.accepted}
        setDataPrivacyAccepted={setDataPrivacyAccepted}
      />,
      mockProvider
    )

    const createPassButton = getByText('KoblenzPass erstellen')
    expect(createPassButton).toBeTruthy()
    expect(createPassButton).toBeEnabled()
    await act(async () => {
      fireEvent.click(createPassButton)
    })
    expect(enqueueSnackbarMock).toHaveBeenCalledWith(
      <FormAlert isToast errorMessage='Mindestens eine Ihrer Angaben ist ungültig.' />,
      {
        variant: 'error',
      }
    )
  })

  it('should not show an error message if all fields are filled correctly', async () => {
    const { getByText } = renderWithOptions(
      <CardSelfServiceForm
        updateCard={updateCard}
        generateCards={generateCards}
        card={exampleCard}
        dataPrivacyAccepted={DataPrivacyAcceptingStatus.accepted}
        setDataPrivacyAccepted={setDataPrivacyAccepted}
      />,
      mockProvider
    )

    const createPassButton = getByText('KoblenzPass erstellen')
    expect(createPassButton).toBeTruthy()
    expect(createPassButton).toBeEnabled()
    await act(async () => {
      fireEvent.click(createPassButton)
    })
    expect(enqueueSnackbarMock).not.toHaveBeenCalled()
  })
})
