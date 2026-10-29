import { BavariaCardType } from '../../../../graphql'
import { renderWithOptions } from '../../../../testing/render'
import StepCardTypeForm from './StepCardTypeForm'

const goldenCardState = {
  ...StepCardTypeForm.initialState,
  cardType: { selectedValue: BavariaCardType.Golden },
}

describe('StepCardTypeForm', () => {
  describe('validate', () => {
    it('should keep the chosen card formats if physical cards are available', () => {
      const result = StepCardTypeForm.validate(
        { ...goldenCardState, wantsPhysicalCard: { checked: true } },
        { physicalCardAvailable: true },
      )
      expect(result).toEqual({
        type: 'valid',
        value: {
          cardType: BavariaCardType.Golden,
          applicationType: null,
          wantsDigitalCard: true,
          wantsPhysicalCard: true,
        },
      })
    })

    it('should only request a digital card if physical cards are not available', () => {
      const result = StepCardTypeForm.validate(
        {
          ...goldenCardState,
          wantsDigitalCard: { checked: false },
          wantsPhysicalCard: { checked: true },
        },
        { physicalCardAvailable: false },
      )
      expect(result).toEqual({
        type: 'valid',
        value: {
          cardType: BavariaCardType.Golden,
          applicationType: null,
          wantsDigitalCard: true,
          wantsPhysicalCard: false,
        },
      })
    })
  })

  it('should show both card format checkboxes if physical cards are available', () => {
    const { getByLabelText } = renderWithOptions(
      <StepCardTypeForm.Component
        state={goldenCardState}
        setState={jest.fn()}
        options={{ physicalCardAvailable: true }}
      />,
      { translation: true },
    )
    expect(getByLabelText('Ich beantrage eine digitale Ehrenamtskarte')).toBeTruthy()
    expect(getByLabelText('Ich beantrage eine physische Ehrenamtskarte')).toBeTruthy()
  })

  it('should only show a checked and disabled digital card checkbox if physical cards are not available', () => {
    const { getByLabelText, queryByLabelText } = renderWithOptions(
      <StepCardTypeForm.Component
        state={{ ...goldenCardState, wantsDigitalCard: { checked: false } }}
        setState={jest.fn()}
        options={{ physicalCardAvailable: false }}
      />,
      { translation: true },
    )
    const digitalCardCheckbox = getByLabelText('Ich beantrage eine digitale Ehrenamtskarte')
    expect(digitalCardCheckbox).toBeChecked()
    expect(digitalCardCheckbox).toBeDisabled()
    expect(queryByLabelText('Ich beantrage eine physische Ehrenamtskarte')).toBeNull()
  })
})
