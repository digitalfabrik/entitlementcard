import { Alert } from '@blueprintjs/core'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { Box, Button, Tooltip } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ButtonBar from '../ButtonBar'
import { AcceptingStoresEntry } from './AcceptingStoresEntry'
import StoresImportAlert from './StoresImportAlert'

type UploadStoresButtonBarProps = {
  goBack: () => void
  acceptingStores: AcceptingStoresEntry[]
  downloadStoreCsv: () => void
  importStores: () => void
  dryRun: boolean
  setDryRun: (value: boolean) => void
}

const StoresButtonBar = ({
  goBack,
  acceptingStores,
  importStores,
  downloadStoreCsv,
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
      <Box sx={{ justifyContent: 'space-between', flexGrow: 1, display: 'flex' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={goBack} color='default' variant='contained'>
          {t('backToSelection')}
        </Button>
        <Box>
          <Tooltip
            title={hasNoAcceptingStores ? t('hasNoAcceptingStores') : t('hasInvalidStores')}
            disableHoverListener={!hasNoAcceptingStores && !hasInvalidStores}>
            <span>
              <Button
                startIcon={<FileDownloadIcon />}
                color='success'
                variant='contained'
                onClick={downloadStoreCsv}
                disabled={hasNoAcceptingStores || hasInvalidStores}>
                {t('storesCsvDownload')}
              </Button>
            </span>
          </Tooltip>
          <Tooltip
            title={hasNoAcceptingStores ? t('hasNoAcceptingStores') : t('hasInvalidStores')}
            disableHoverListener={!hasNoAcceptingStores && !hasInvalidStores}>
            <span>
              <Button
                startIcon={<FileUploadIcon />}
                color='primary'
                variant='contained'
                onClick={() => setImportDialogIsOpen(true)}
                disabled={hasNoAcceptingStores || hasInvalidStores}>
                {t('importStores')}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
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
