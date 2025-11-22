import { Box, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import BaseCheckbox from '../../../../shared/components/BaseCheckbox'

type StoreImportAlertProps = {
  dryRun: boolean
  setDryRun: (value: boolean) => void
  storesCount: number
}

const STORES_COUNT_NOTE_THRESHOLD = 500
const STORES_IMPORT_PER_SECOND = 100
const StoresImportAlert = ({ dryRun, setDryRun, storesCount }: StoreImportAlertProps): ReactElement => {
  const { t } = useTranslation('stores')
  return (
    <>
      {dryRun ? (
        <Typography component='span' data-testid='dry-run-alert'>
          <b>{t('dryRun')}:</b> {t('dryRunDescription')}
        </Typography>
      ) : (
        <>
          <Typography component='span' data-testid='prod-run-alert'>
            <b>{t('caution')}:</b> {t('cautionDescription')}
          </Typography>
          <br />
          {storesCount > STORES_COUNT_NOTE_THRESHOLD && (
            <Box sx={{ marginTop: 1.5 }} data-testid='duration-alert'>
              <b>{t('timeForImport')}:</b> {Math.ceil(storesCount / STORES_IMPORT_PER_SECOND / 60)} {t('minutes')}.{' '}
              <br />
              {t('pleaseDoNotCloseTheWindow')}
            </Box>
          )}
        </>
      )}
      <BaseCheckbox
        checked={dryRun}
        onChange={checked => setDryRun(checked)}
        label={t('dryRun')}
        hasError={false}
        errorMessage={undefined}
      />
    </>
  )
}

export default StoresImportAlert
