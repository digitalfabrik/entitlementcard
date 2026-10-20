import { ApplicationType } from '../../../graphql'
import { renderWithOptions } from '../../../testing/render'
import { ApplicationTypeChip } from './ApplicationTypeChip'

describe('ApplicationTypeChip', () => {
  it('should show first application', () => {
    const { getByText } = renderWithOptions(
      <ApplicationTypeChip applicationType={ApplicationType.FirstApplication} />,
      { translation: true },
    )
    expect(getByText('Erstantrag')).toBeTruthy()
  })

  it('should show renewal application', () => {
    const { getByText } = renderWithOptions(
      <ApplicationTypeChip applicationType={ApplicationType.RenewalApplication} />,
      { translation: true },
    )
    expect(getByText('Verlängerung')).toBeTruthy()
  })
})
