import React, { ReactElement } from 'react'
import styled from 'styled-components'

type StoresImportDuplicatesProps = { entries: number[][] }

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const StoresImportDuplicates = ({ entries }: StoresImportDuplicatesProps): ReactElement => (
  <Container>
    Die CSV enthält doppelte Einträge:
    {entries.map(entry => {
      const entries = entry.join(', ')
      return <span key={entries}>Die Einträge {entries} sind identisch.</span>
    })}
    Bitte löschen Sie die doppelten Einträge.
  </Container>
)

export default StoresImportDuplicates
