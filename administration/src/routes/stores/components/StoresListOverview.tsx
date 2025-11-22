import { AddBusinessOutlined, FileUpload } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import Blankslate from '../../../shared/components/Blankslate'
import { AcceptingStoresData } from '../../applications/types/types'
import StoresListTable from './StoresListTable'

const StoresListOverview = ({ data }: { data: AcceptingStoresData[] }): ReactElement => {
  const { t } = useTranslation('stores')

  const fileUploadButton = (
    <Button color='primary' startIcon={<FileUpload />} href='./import'>
      {t('storesCsvImport')}
    </Button>
  )

  return (
    <>
      {data.length === 0 ? (
        <Blankslate
          containerSx={{ m: 4 }}
          icon={<AddBusinessOutlined color='disabled' sx={{ fontSize: '64px' }} />}
          title={t('storesListOverviewNoEntryTitle')}
          description={t('storesListOverviewNoEntryDescription')}>
          {fileUploadButton}
        </Blankslate>
      ) : (
        <>
          <Box sx={{ py: 2, justifyContent: 'flex-end', display: 'flex' }}>{fileUploadButton}</Box>
          <StoresListTable data={data} />
        </>
      )}
    </>
  )
}

export default StoresListOverview
