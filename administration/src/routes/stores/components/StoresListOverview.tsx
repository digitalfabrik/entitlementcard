import { AddBusinessOutlined, FileUpload } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Blankslate from '../../../components/Blankslate'
import { AcceptingStoresData } from '../../applications/types/types'
import ManageStoreDialog from './ManageStoreDialog'
import StoresListTable from './StoresListTable'

const StoresListOverview = ({ data }: { data: AcceptingStoresData[] }): ReactElement => {
  const { t } = useTranslation('stores')
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [activeStore, setActiveStore] = useState<AcceptingStoresData>()

  const editStore = (storeId: number) => {
    setOpenEditDialog(true)
    setActiveStore(data.find(store => store.id === storeId))
  }

  const saveStore = () => console.log('saveStore')

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
          <StoresListTable data={data} editStore={editStore} />
        </>
      )}
      <ManageStoreDialog
        loading={false}
        open={openEditDialog}
        isEditMode={activeStore !== undefined}
        activeStore={activeStore}
        onClose={() => setOpenEditDialog(false)}
        onConfirm={saveStore}
      />
    </>
  )
}

export default StoresListOverview
