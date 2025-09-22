import { fireEvent } from '@testing-library/react'
import React from 'react'

import { FreinetAgency } from '../../../../generated/graphql'
import { renderWithTranslation } from '../../../../testing/render'
import FreinetSettingsCard from '../FreinetSettingsCard'

describe('FreinetSettingsCard', () => {
  const onSave = jest.fn()
  const setDateTransferActivated = jest.fn()
  const agencyData: FreinetAgency = {
    agencyId: 908,
    agencyName: 'EAK-Stadt Augsburg',
    apiAccessKey: '123456',
    dataTransferActivated: false,
  }

  it('should render agency information', () => {
    const { getByText } = renderWithTranslation(
      <FreinetSettingsCard
        agencyInformation={agencyData}
        onSave={onSave}
        dataTransferActivated={false}
        setDataTransferActivated={setDateTransferActivated}
      />
    )
    expect(getByText(agencyData.agencyName)).toBeTruthy()
    expect(getByText(agencyData.agencyId)).toBeTruthy()
    expect(getByText(agencyData.apiAccessKey)).toBeTruthy()
  })

  it('should call onSave if save button has been clicked', () => {
    const { getByText } = renderWithTranslation(
      <FreinetSettingsCard
        agencyInformation={agencyData}
        onSave={onSave}
        dataTransferActivated={false}
        setDataTransferActivated={setDateTransferActivated}
      />
    )
    const saveButton = getByText('Speichern') as HTMLElement
    fireEvent.click(saveButton)
    expect(onSave).toHaveBeenCalled()
  })
})
