import { Box, Link, SxProps } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TFunction } from 'i18next'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { isDevelopmentEnvironment } from '../../../util/helper'
import { AcceptingStoresData } from '../../applications/types/types'
import TableMenu from './TableMenu'

const customToolBarStyles: SxProps = {
  '.MuiButtonBase-root': {
    '&[aria-label="Exportieren"], &[aria-label="Filter"], &[aria-label="Spalten"]': {
      display: 'none',
    },
  },
  '.MuiDataGrid-toolbar': { '.MuiDivider-vertical': { display: 'none' } },
}

const EMailCell = ({ email }: { email: string }): ReactElement => <Link href={`mailto:${email}`}>{email}</Link>
const columns = (t: TFunction, editStore: (storeId: number) => void): GridColDef[] => [
  {
    field: 'id',
    headerName: '',
    width: 60,
    renderCell: ({ row }: { row: AcceptingStoresData }) => <TableMenu storeId={row.id} editStore={editStore} />,
  },
  {
    field: 'name',
    headerName: t('storesListColumnName'),
    width: 250,
  },
  {
    field: 'category',
    headerName: t('storesListColumnCategory'),
    width: 200,
    valueGetter: (_, row: AcceptingStoresData) => row.category.name,
  },
  {
    field: 'address',
    headerName: t('storesListColumnAddress'),
    width: 300,
    valueGetter: (_, row: AcceptingStoresData) =>
      row.physicalStore
        ? `${row.physicalStore.address.street}, ${row.physicalStore.address.postalCode} ${row.physicalStore.address.location}`
        : '',
  },
  {
    field: 'telephone',
    headerName: t('storesListColumnTelephone'),
    width: 160,
    valueGetter: (_, row: AcceptingStoresData) => row.contact.telephone,
  },
  {
    field: 'email',
    headerName: t('storesListColumnEmail'),
    width: 250,
    renderCell: ({ row }: { row: AcceptingStoresData }) =>
      row.contact.email ? <EMailCell email={row.contact.email} /> : undefined,
    valueGetter: (_, row: AcceptingStoresData) => row.contact.email,
  },
]

const StoresListTable = ({
  data,
  editStore,
}: {
  data: AcceptingStoresData[]
  editStore: (storeId: number) => void
}): ReactElement => {
  const { t } = useTranslation('stores')

  return (
    <Box sx={{ height: '75vh', width: '100%' }}>
      <DataGrid
        rows={data}
        showToolbar
        sx={{
          '.MuiTablePagination-selectLabel': { m: 0 },
          '.MuiTablePagination-displayedRows': { m: 0 },
          ...customToolBarStyles,
        }}
        columns={columns(t, editStore)}
        initialState={{
          columns: {
            columnVisibilityModel: {
              // Show menu only in development mode
              id: isDevelopmentEnvironment(),
            },
          },
          sorting: {
            sortModel: [{ field: 'name', sort: 'asc' }],
          },
        }}
        disableRowSelectionOnClick
        disableColumnMenu
      />
    </Box>
  )
}

export default StoresListTable
