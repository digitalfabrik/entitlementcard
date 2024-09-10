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

type StoreImportAlertProps = {
  dryRun: boolean
  setDryRun: (value: boolean) => void
}

const StoresImportAlert = ({ dryRun, setDryRun }: StoreImportAlertProps): ReactElement => {
  return (
    <>
      {dryRun ? (
        <span data-testid='dry-run-alert'>
          <b>Testlauf:</b> In diesem Testlauf wird nur simuliert, wie viele Stores geändert oder gelöscht werden würden.
          Es werden keine Daten in die Datenbank geschrieben.
        </span>
      ) : (
        <span data-testid='prod-run-alert'>
          <b>Achtung:</b> Akzeptanzpartner, welche aktuell in der Datenbank gespeichert, aber nicht in der Tabelle
          vorhanden sind, werden gelöscht!
        </span>
      )}
      <CheckboxContainer>
        <StyledCheckbox checked={dryRun} onChange={e => setDryRun(e.currentTarget.checked)} label='Testlauf' />
      </CheckboxContainer>
    </>
  )
}

export default StoresImportAlert
