import { ArrowBack, UploadFile } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ButtonBar from '../../../../components/ButtonBar'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import { AcceptingStoresEntry } from '../utils/AcceptingStoresEntry'
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
            variant='contained'
            onClick={() => setImportDialogIsOpen(true)}
            disabled={hasNoAcceptingStores || hasInvalidStores}>
            {t('importStores')}
          </Button>
        </div>
      </Tooltip>
      <ConfirmDialog
        open={importDialogIsOpen}
        title={t('importStores')}
        id='import-stores-dialog'
        onClose={() => setImportDialogIsOpen(false)}
        onConfirm={confirmImportDialog}>
        <StoresImportAlert dryRun={dryRun} setDryRun={setDryRun} storesCount={acceptingStores.length} />
      </ConfirmDialog>
    </ButtonBar>
  )
}

export default StoresButtonBar
