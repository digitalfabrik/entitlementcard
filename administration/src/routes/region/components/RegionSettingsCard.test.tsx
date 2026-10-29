import { fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AvailableCardFormats } from '../../../graphql'
import { renderWithOptions } from '../../../testing/render'
import RegionSettingsCard from './RegionSettingsCard'

describe('RegionSettingsCard', () => {
  const onSave = vi.fn()
  const renderRegionSettingsCard = ({
    defaultApplicationActivation,
    defaultConfirmationMailActivation,
    defaultAvailableCardFormats = AvailableCardFormats.DigitalAndPhysical,
    showAvailableCardFormats = true,
  }: {
    defaultApplicationActivation: boolean
    defaultConfirmationMailActivation: boolean
    defaultAvailableCardFormats?: AvailableCardFormats
    showAvailableCardFormats?: boolean
  }) =>
    renderWithOptions(
      <RegionSettingsCard
        loading={false}
        defaultApplicationActivation={defaultApplicationActivation}
        defaultConfirmationMailActivation={defaultConfirmationMailActivation}
        defaultAvailableCardFormats={defaultAvailableCardFormats}
        showAvailableCardFormats={showAvailableCardFormats}
        onSave={onSave}
      />,
      { translation: true },
    )

  beforeEach(() => {
    onSave.mockReset()
  })

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
    expect(
      getByLabelText('Region ist für den neuen Beantragungsprozess freigeschaltet'),
    ).toBeChecked()
    expect(
      getByLabelText(
        'Nach der Erstellung einer Karte verschickt das System eine E-Mail-Bestätigung an den Antragsstellenden mit einem Link zur Vorab-Aktivierung',
      ),
    ).not.toBeChecked()
  })

  it('should select the available card formats according to the default value', () => {
    const { getByLabelText } = renderRegionSettingsCard({
      defaultApplicationActivation: true,
      defaultConfirmationMailActivation: true,
      defaultAvailableCardFormats: AvailableCardFormats.Digital,
    })
    expect(getByLabelText('Digital')).toBeChecked()
    expect(getByLabelText('Digital und physisch')).not.toBeChecked()
  })

  it('should save the selected available card formats', () => {
    const { getByLabelText, getByText } = renderRegionSettingsCard({
      defaultApplicationActivation: true,
      defaultConfirmationMailActivation: false,
    })
    fireEvent.click(getByLabelText('Digital'))
    fireEvent.click(getByText('Speichern'))
    expect(onSave).toHaveBeenCalledWith(true, false, AvailableCardFormats.Digital)
  })

  it('should hide the available card formats if not shown', () => {
    const { queryByText } = renderRegionSettingsCard({
      defaultApplicationActivation: true,
      defaultConfirmationMailActivation: true,
      showAvailableCardFormats: false,
    })
    expect(queryByText('Verfügbare Kartenformate')).toBeNull()
  })
})
