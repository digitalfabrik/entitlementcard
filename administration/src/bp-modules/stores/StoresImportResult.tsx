import { Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

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
    <Container>
      <Typography variant='h6' data-testid='import-result-headline'>{`${t('articleMale')} ${
        dryRun ? t('dryRunImport') : t('import')
      } ${t('wasSuccessful')}`}</Typography>
      <Typography variant='body2' component='span'>
        {dryRun ? t('importResult') : t('importResult')}
      </Typography>
      <br />
      <div>
        {t('storesCreated')}{' '}
        <Typography variant='body2' component='span' data-testid='storesCreated'>
          {storesCreated}
        </Typography>
      </div>
      <div>
        {t('storesDeleted')}{' '}
        <Typography variant='body2' component='span' data-testid='storesDeleted'>
          {storesDeleted}
        </Typography>
      </div>
      <div>
        {t('storesUntouched')}{' '}
        <Typography variant='body2' component='span' data-testid='storesUntouched'>
          {storesUntouched}
        </Typography>
      </div>
    </Container>
  )
}

export default StoresImportResult
