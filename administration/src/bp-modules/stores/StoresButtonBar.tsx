import { Alert, Button, Tooltip } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

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

const StoresButtonBar = ({
  goBack,
  acceptingStores,
  importStores,
  dryRun,
  setDryRun,
}: UploadStoresButtonBarProps): ReactElement => {
  const hasInvalidStores = !acceptingStores.every(store => store.isValid())
  const hasNoAcceptingStores = acceptingStores.length === 0
  const { t } = useTranslation('stores')
  const [importDialogIsOpen, setImportDialogIsOpen] = useState(false)
  const confirmImportDialog = () => {
    importStores()
    setImportDialogIsOpen(false)
  }

  return (
    <ButtonBar>
      <Button icon='arrow-left' text={t('backToSelection')} onClick={goBack} />
      <Tooltip
        placement='top'
        content={hasNoAcceptingStores ? t('hasNoAcceptingStores') : t('hasInvalidStores')}
        disabled={!hasNoAcceptingStores && !hasInvalidStores}
        openOnTargetFocus={false}>
        <Button
          icon='upload'
          text={t('importStores')}
          intent='success'
          onClick={() => setImportDialogIsOpen(true)}
          disabled={hasNoAcceptingStores || hasInvalidStores}
        />
      </Tooltip>
      <Alert
        cancelButtonText={t('misc:cancel')}
        confirmButtonText={t('importStores')}
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
