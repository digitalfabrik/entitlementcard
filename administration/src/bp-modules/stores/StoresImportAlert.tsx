import { Checkbox } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const StyledCheckbox = styled(Checkbox)`
  margin: 12px 0;
  align-self: center;
`

const CheckboxContainer = styled.div`
  padding: 0 12px;
  display: flex;
`

const DurationContainer = styled.div`
  margin-top: 12px;
`

type StoreImportAlertProps = {
  dryRun: boolean
  setDryRun: (value: boolean) => void
  storesCount: number
}

const STORES_COUNT_NOTE_THRESHOLD = 500
const STORES_IMPORT_PER_SECOND = 100
const StoresImportAlert = ({ dryRun, setDryRun, storesCount }: StoreImportAlertProps): ReactElement => (
  <>
    {dryRun ? (
      <span data-testid='dry-run-alert'>
        <b>Testlauf:</b> In diesem Testlauf wird nur simuliert, wie viele Akzeptanzpartner geändert oder gelöscht werden
        würden. Es werden noch keine Änderungen an der Datenbank vorgenommen.
      </span>
    ) : (
      <>
        <span data-testid='prod-run-alert'>
          <b>Achtung:</b> Akzeptanzpartner, welche aktuell in der Datenbank gespeichert, aber nicht in der Tabelle
          vorhanden sind, werden gelöscht!
        </span>
        <br />
        {storesCount > STORES_COUNT_NOTE_THRESHOLD && (
          <DurationContainer data-testid='duration-alert'>
            <b>Geschätzte Dauer des Imports:</b> {Math.ceil(storesCount / STORES_IMPORT_PER_SECOND / 60)} Minuten.{' '}
            <br />
            Bitte schließen sie das Browserfenster nicht!
          </DurationContainer>
        )}
      </>
    )}
    <CheckboxContainer>
      <StyledCheckbox checked={dryRun} onChange={e => setDryRun(e.currentTarget.checked)} label='Testlauf' />
    </CheckboxContainer>
  </>
)

export default StoresImportAlert
