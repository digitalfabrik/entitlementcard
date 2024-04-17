import { fireEvent, render } from '@testing-library/react'

import RegionSettingsCard from './RegionSettingsCard'

describe('RegionSettingsCard', () => {
  const onSave = jest.fn()
  const renderRegionSettingsCard = ({
    defaultApplicationActivation,
    defaultConfirmationMailActivation,
  }: {
    defaultApplicationActivation: boolean
    defaultConfirmationMailActivation: boolean
  }) =>
    render(
      <RegionSettingsCard
        loading={false}
        defaultApplicationActivation={defaultApplicationActivation}
        defaultConfirmationMailActivation={defaultConfirmationMailActivation}
        onSave={onSave}
      />
    )

  it('should execute on save if button was clicked', () => {
    const { getByText } = renderRegionSettingsCard({
      defaultApplicationActivation: true,
      defaultConfirmationMailActivation: true,
    })
    const saveButton = getByText('Speichern')
    fireEvent.click(saveButton)
    expect(onSave).toHaveBeenCalled()
  })

  it('should check checkboxes according to the default values', () => {
    const { getByLabelText } = renderRegionSettingsCard({
      defaultApplicationActivation: true,
      defaultConfirmationMailActivation: false,
    })
    expect(getByLabelText('Region ist für den neuen Beantragungsprozess freigeschaltet')).toBeChecked()
    expect(
      getByLabelText('Benachrichtigung über erfolgte Kartenerstellung wird an den Antragssteller versendet')
    ).not.toBeChecked()
  })
})
