import { Box, Typography } from '@mui/material'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

type StoreImportResultProps = {
  storesCreated: number
  storesDeleted: number
  storesUntouched: number
  dryRun: boolean
}

const StoresImportResult = ({
  storesDeleted,
  storesUntouched,
  storesCreated,
  dryRun,
}: StoreImportResultProps): ReactElement => {
  const { t } = useTranslation('stores')
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant='h6' data-testid='import-result-headline'>{`${t('articleMale')} ${
        dryRun ? t('dryRunImport') : t('import')
      } ${t('wasSuccessful')}`}</Typography>
      <Typography component='span'>{dryRun ? t('importResult') : t('importResult')}</Typography>
      <br />
      <div>
        {t('storesCreated')}{' '}
        <Typography component='span' data-testid='storesCreated'>
          {storesCreated}
        </Typography>
      </div>
      <div>
        {t('storesDeleted')}{' '}
        <Typography component='span' data-testid='storesDeleted'>
          {storesDeleted}
        </Typography>
      </div>
      <div>
        {t('storesUntouched')}{' '}
        <Typography component='span' data-testid='storesUntouched'>
          {storesUntouched}
        </Typography>
      </div>
    </Box>
  )
}

export default StoresImportResult
