import { Alert, Button, Tooltip } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'

import ButtonBar from '../ButtonBar'
import { AcceptingStoresEntry } from './AcceptingStoresEntry'
import StoresImportAlert from './StoresImportAlert'

type UploadStoresButtonBarProps = {
  goBack: () => void
  acceptingStores: AcceptingStoresEntry[]
  importStores: () => void
  dryRun: boolean
  setDryRun: (value: boolean) => void
}

const getToolTipMessage = (hasNoAcceptingStores: boolean, hasInvalidStores: boolean): string => {
  if (hasNoAcceptingStores) {
    return 'Laden sie bitte eine Datei mit Akzeptanzpartnern hoch.'
  }
  if (hasInvalidStores) {
    return 'Fehlerhafte Einträge. Bitte prüfen sie die rot markierten Felder.'
  }
  return 'Importiere Akzeptanzpartner'
}

const StoresButtonBar = ({
  goBack,
  acceptingStores,
  importStores,
  dryRun,
  setDryRun,
}: UploadStoresButtonBarProps): ReactElement => {
  const hasInvalidStores = !acceptingStores.every(store => store.isValid())
  const hasNoAcceptingStores = acceptingStores.length === 0
  const [importDialogIsOpen, setImportDialogIsOpen] = useState(false)
  const confirmImportDialog = () => {
    importStores()
    setImportDialogIsOpen(false)
  }

  return (
    <ButtonBar>
      <Button icon='arrow-left' text='Zurück zur Auswahl' onClick={goBack} />
      <Tooltip
        placement='top'
        content={getToolTipMessage(hasNoAcceptingStores, hasInvalidStores)}
        disabled={false}
        openOnTargetFocus={false}>
        <Button
          icon='upload'
          text='Import Stores'
          intent='success'
          onClick={() => setImportDialogIsOpen(true)}
          disabled={hasNoAcceptingStores || hasInvalidStores}
        />
      </Tooltip>
      <Alert
        cancelButtonText='Abbrechen'
        confirmButtonText='Stores importieren'
        icon='upload'
        intent='warning'
        isOpen={importDialogIsOpen}
        onCancel={() => setImportDialogIsOpen(false)}
        onConfirm={confirmImportDialog}>
        <StoresImportAlert dryRun={dryRun} setDryRun={setDryRun} storesCount={acceptingStores.length} />
      </Alert>
    </ButtonBar>
  )
}

export default StoresButtonBar
