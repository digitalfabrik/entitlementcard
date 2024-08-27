import { H4 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

type StoreImportResultProps = {
  storesCreated: number
  storesDeleted: number
  storesUntouched: number
}

const StoresImportResult = ({
  storesDeleted,
  storesUntouched,
  storesCreated,
}: StoreImportResultProps): ReactElement => {
  return (
    <Container>
      <H4>Der Import der Akzeptanzpartner war erfolgreich!</H4>
      <span>Akzeptanzstellen erstellt: {storesCreated}</span>
      <span>Akzeptanzstellen gelöscht: {storesDeleted}</span>
      <span>Akzeptanzstellen unverändert: {storesUntouched}</span>
    </Container>
  )
}

export default StoresImportResult
