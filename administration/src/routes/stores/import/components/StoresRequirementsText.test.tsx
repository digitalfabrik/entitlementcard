import React from 'react'

import type { StoresFieldConfig } from '../../../../project-configs'
import { storesManagementConfig } from '../../../../project-configs/storesManagementConfig'
import { renderWithOptions } from '../../../../testing/render'
import StoresRequirementsText from './StoresRequirementsText'

describe('StoresRequirementsText', () => {
  const fields = (storesManagementConfig as { enabled: boolean; fields: StoresFieldConfig[] })
    .fields
  const expectedHeaders = fields
    .map(field => (field.isMandatory ? `${field.name}*` : field.name))
    .join(', ')

  it('should show all columns, marking mandatory ones with an asterisk', () => {
    const { getByText } = renderWithOptions(<StoresRequirementsText header={fields} />, {
      translation: true,
    })

    expect(getByText(`Spaltenformat: ${expectedHeaders}`)).toBeTruthy()
  })
})
