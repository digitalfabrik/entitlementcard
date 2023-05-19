import styled from 'styled-components'

import { ENTRY_LIMIT, FILE_SIZE_LIMIT_MEGA_BYTES } from './ImportCardsInput'

const RequirementsList = styled.ul`
  text-align: left;
  padding-left: 20px;
`

type ImportCardsRequirementsProps = {
  header: string[]
}

const ImportCardsRequirementsText = ({ header }: ImportCardsRequirementsProps) => {
  return (
    <RequirementsList>
      <li>Maximale Dateigröße: {FILE_SIZE_LIMIT_MEGA_BYTES}MB</li>
      <li>Dateiformat: CSV</li>
      <li>Maximalanzahl an Einträgen: {ENTRY_LIMIT}</li>
      <li>Spaltenformat: {header.join(', ')}</li>
      <li>Gültiges Datumsformat: tt.mm.jjjj (Beispiel: 01.01.1970)</li>
    </RequirementsList>
  )
}

export default ImportCardsRequirementsText
