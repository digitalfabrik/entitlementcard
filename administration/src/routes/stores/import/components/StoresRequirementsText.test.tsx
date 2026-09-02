import React from 'react'

import type { StoresFieldConfig } from '../../../../project-configs'
import {
  FIELD_LATITUDE,
  FIELD_LONGITUDE,
  storesManagementConfig,
} from '../../../../project-configs/storesManagementConfig'
import { renderWithOptions } from '../../../../testing/render'
import StoresRequirementsText from './StoresRequirementsText'

describe('StoresRequirementsText', () => {
  const fields = (storesManagementConfig as { enabled: boolean; fields: StoresFieldConfig[] })
    .fields
  const expectedHeaders = fields
    // Long/Lat is only required for the import not for the csv file, since it will be resolved by location
    .filter(field => ![FIELD_LATITUDE, FIELD_LONGITUDE].includes(field.name))
    .map(field => (field.isMandatory ? `${field.name}*` : field.name))
    .join(', ')

  it('should show mandatory requirements with asterisks', () => {
    const { getByText } = renderWithOptions(<StoresRequirementsText header={fields} />, {
      translation: true,
    })

    expect(getByText(`Erforderliche Spalten: ${expectedHeaders}`)).toBeTruthy()
  })
})
