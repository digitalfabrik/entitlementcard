import { Alert } from '@blueprintjs/core'
import { ArrowBack, UploadFile } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
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

  let tooltip
  if (hasNoAcceptingStores) {
    tooltip = t('hasNoAcceptingStores')
  }
  if (hasInvalidStores) {
    tooltip = t('hasInvalidStores')
  }

  return (
    <ButtonBar>
      <Button startIcon={<ArrowBack />} onClick={goBack}>
        {t('backToSelection')}
      </Button>
      <Tooltip title={tooltip}>
        <div>
          <Button
            startIcon={<UploadFile />}
            color='primary'
            onClick={() => setImportDialogIsOpen(true)}
            disabled={hasNoAcceptingStores || hasInvalidStores}>
            {t('importStores')}
          </Button>
        </div>
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
