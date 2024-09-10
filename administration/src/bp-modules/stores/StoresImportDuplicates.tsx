import React, { ReactElement } from 'react'
import styled from 'styled-components'

type StoresImportDuplicatesProps = { entries: number[][] }

const Container = styled.div`
  display: flex;
  flex-direction: column;
`
const StoresImportDuplicates = ({ entries }: StoresImportDuplicatesProps): ReactElement => {
  return (
    <Container>
      Die CSV enthält doppelte Einträge:
      {entries.map((entry, index) => (
        <span key={index}>Eintrag {entry.join(' und ')} sind identisch.</span>
      ))}
    </Container>
  )
}

export default StoresImportDuplicates
