import { H5 } from '@blueprintjs/core'
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
  dryRun: boolean
}

const StoresImportResult = ({
  storesDeleted,
  storesUntouched,
  storesCreated,
  dryRun,
}: StoreImportResultProps): ReactElement => (
  <Container>
    <H5 data-testid='import-result-headline'>{`Der ${
      dryRun ? 'Testimport' : 'Import'
    } der Akzeptanzpartner war erfolgreich!`}</H5>
    <span>
      {dryRun ? 'Folgende Änderungen würden sich ergeben:' : 'Folgende Änderungen in der Datenbank wurden vorgenommen:'}
    </span>
    <br />
    <div>
      Akzeptanzstellen erstellt: <span data-testid='storesCreated'>{storesCreated}</span>
    </div>
    <div>
      Akzeptanzstellen gelöscht: <span data-testid='storesDeleted'>{storesDeleted}</span>
    </div>
    <div>
      Akzeptanzstellen unverändert: <span data-testid='storesUntouched'>{storesUntouched}</span>
    </div>
  </Container>
)

export default StoresImportResult
