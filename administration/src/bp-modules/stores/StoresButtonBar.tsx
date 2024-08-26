import { Button, Tooltip } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

import ButtonBar from '../ButtonBar'
import { AcceptingStoreEntry } from './AcceptingStoreEntry'

type UploadStoresButtonBarProps = {
  goBack: () => void
  acceptingStores: AcceptingStoreEntry[]
  importStores: () => void
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

const StoresButtonBar = ({ goBack, acceptingStores, importStores }: UploadStoresButtonBarProps): ReactElement => {
  const hasInvalidStores = !acceptingStores.every(store => store.isValid())
  const hasNoAcceptingStores = acceptingStores.length === 0

  return (
    <ButtonBar>
      <Button icon='arrow-left' text='Zurück zur Auswahl' onClick={goBack} />
      <Tooltip placement='top' content={getToolTipMessage(hasNoAcceptingStores, hasInvalidStores)} disabled={false}>
        <Button
          icon='upload'
          text='Import Stores'
          intent='success'
          onClick={importStores}
          disabled={hasNoAcceptingStores || hasInvalidStores}
        />
      </Tooltip>
    </ButtonBar>
  )
}

export default StoresButtonBar
