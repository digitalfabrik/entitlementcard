import { Alert, Button, Tooltip } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'

import ButtonBar from '../ButtonBar'
import { AcceptingStoreEntry } from './AcceptingStoreEntry'
import StoresImportAlert from './StoresImportAlert'

type UploadStoresButtonBarProps = {
  goBack: () => void
  acceptingStores: AcceptingStoreEntry[]
  importStores: () => void
  loading: boolean
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
  loading,
  dryRun,
  setDryRun,
}: UploadStoresButtonBarProps): ReactElement => {
  const hasInvalidStores = !acceptingStores.every(store => store.isValid())
  const hasNoAcceptingStores = acceptingStores.length === 0
  const [uploadDialog, setUploadDialog] = useState(false)
  const confirmImportDialog = () => {
    importStores()
    setUploadDialog(false)
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
          onClick={() => setUploadDialog(true)}
          disabled={hasNoAcceptingStores || hasInvalidStores}
        />
      </Tooltip>
      <Alert
        cancelButtonText='Abbrechen'
        confirmButtonText='Stores importieren'
        icon='upload'
        intent='warning'
        isOpen={uploadDialog}
        loading={loading}
        onCancel={() => setUploadDialog(false)}
        onConfirm={confirmImportDialog}>
        <StoresImportAlert dryRun={dryRun} setDryRun={setDryRun} />
      </Alert>
    </ButtonBar>
  )
}

export default StoresButtonBar
