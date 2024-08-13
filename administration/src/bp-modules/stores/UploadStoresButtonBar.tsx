import { Button, Tooltip } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

import ButtonBar from '../ButtonBar'
import { Store } from './AcceptingStoreEntry'

type UploadStoresButtonBarProps = {
  goBack: () => void
  acceptingStores: Store[]
  importStores: () => void
}

const getToolTipMessage = (hasAcceptanceStores: boolean, hasValidStores: boolean): string => {
  if (!hasAcceptanceStores) {
    return 'Lade eine Datei mit Akzeptanzpartnern hoch.'
  }
  if (!hasValidStores) {
    return 'Fehlerhafte Einträge. Bitte prüfe die rot markierten Felder'
  }
  return 'Importiere Akzeptanzpartner'
}

const UploadStoresButtonBar = ({ goBack, acceptingStores, importStores }: UploadStoresButtonBarProps): ReactElement => {
  const allStoresAreValid = acceptingStores.every(store => store.isValid())
  const hasAcceptanceStores = acceptingStores.length !== 0

  return (
    <ButtonBar>
      <Button icon='arrow-left' text='Zurück zur Auswahl' onClick={goBack} />
      <Tooltip placement='top' content={getToolTipMessage(hasAcceptanceStores, allStoresAreValid)} disabled={false}>
        <Button
          icon='upload'
          text='Upload Stores'
          intent='success'
          onClick={importStores}
          disabled={!hasAcceptanceStores || !allStoresAreValid}
        />
      </Tooltip>
    </ButtonBar>
  )
}

export default UploadStoresButtonBar
