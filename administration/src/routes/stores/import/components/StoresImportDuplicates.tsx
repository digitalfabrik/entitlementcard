import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

type StoresImportDuplicatesProps = { entries: number[][] }

const StoresImportDuplicates = ({ entries }: StoresImportDuplicatesProps): ReactElement => {
  const { t } = useTranslation('stores')
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {t('csvInvalidDuplicateEntries')}:
      {entries.map(entry => {
        const entries = entry.join(', ')
        return (
          <Typography component='span' key={entries}>
            {t('theseEntriesAreDuplicated', { entries })}
          </Typography>
        )
      })}
      {t('pleaseDeleteDuplicates')}
    </Box>
  )
}

export default StoresImportDuplicates
