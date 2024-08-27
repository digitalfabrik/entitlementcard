import {Alert, Button, Tooltip } from '@blueprintjs/core'
import React, {ReactElement, useState} from 'react'

import ButtonBar from '../ButtonBar'
import { AcceptingStoreEntry } from './AcceptingStoreEntry'

type UploadStoresButtonBarProps = {
  goBack: () => void
  acceptingStores: AcceptingStoreEntry[]
  importStores: () => void
  loading: boolean
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

const StoresButtonBar = ({ goBack, acceptingStores, importStores, loading }: UploadStoresButtonBarProps): ReactElement => {
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
      <Tooltip placement='top' content={getToolTipMessage(hasNoAcceptingStores, hasInvalidStores)} disabled={false}>
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
          <p><b>Achtung:</b> Akzeptanzpartner, welche aktuell in der Datenbank gespeichert, aber nicht in der Tabelle vorhanden sind, werden gelöscht!</p>
        </Alert>
    </ButtonBar>
  )
}

export default StoresButtonBar
