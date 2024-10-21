import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { FILE_SIZE_LIMIT_MEGA_BYTES } from './StoresCSVInput'

const RequirementsList = styled.ul`
  text-align: left;
  padding-left: 20px;
`

type ImportCardsRequirementsProps = {
  header: string[]
}

const StoresRequirementsText = ({ header }: ImportCardsRequirementsProps): ReactElement => (
  <RequirementsList>
    <li>Maximale Dateigröße: {FILE_SIZE_LIMIT_MEGA_BYTES}MB</li>
    <li>Dateiformat: CSV</li>
    <li>Erforderliche Spalten: {header.join(', ')}</li>
  </RequirementsList>
)

export default StoresRequirementsText
