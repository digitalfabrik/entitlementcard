import React from 'react'

import type { StoresFieldConfig } from '../../../project-configs/getProjectConfig'
import { storesManagementConfig } from '../../../project-configs/storesManagementConfig'
import { renderWithTranslation } from '../../../testing/render'
import StoresRequirementsText from '../StoresRequirementsText'

describe('StoresRequirementsText', () => {
  const fields = (storesManagementConfig as { enabled: boolean; fields: StoresFieldConfig[] }).fields
  const expectedHeaders = fields.map(field => (field.isMandatory ? `${field.name}*` : field.name)).join(', ')

  it('should show mandatory requirements with asterisks', () => {
    const { getByText } = renderWithTranslation(<StoresRequirementsText header={fields} />)

    expect(getByText(`Erforderliche Spalten: ${expectedHeaders}`)).toBeTruthy()
  })
})
