import { Tooltip } from '@blueprintjs/core'
import { Button } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
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

  // TODO fix button alignment
  return (
    <ButtonBar>
      <Button color='inherit' onClick={goBack}>
        {t('backToSelection')}
      </Button>
      <Tooltip
        placement='top'
        content={hasNoAcceptingStores ? t('hasNoAcceptingStores') : t('hasInvalidStores')}
        disabled={!hasNoAcceptingStores && !hasInvalidStores}
        openOnTargetFocus={false}>
        <Button
          color='primary'
          variant='contained'
          onClick={() => setImportDialogIsOpen(true)}
          disabled={hasNoAcceptingStores || hasInvalidStores}>
          {t('importStores')}
        </Button>
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
