import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { Stack } from '@mui/system'
import React, { ReactElement } from 'react'

import { StoresFieldConfig } from '../../../../project-configs/getProjectConfig'
import StoreTableEntry from '../../components/StoreTableEntry'
import { AcceptingStoresEntry } from '../utils/acceptingStoresEntry'

type CardImportTableProps = {
  fields: StoresFieldConfig[]
  acceptingStores: AcceptingStoresEntry[]
}

const StoresTable = ({ fields, acceptingStores }: CardImportTableProps): ReactElement => (
  <Stack sx={{ width: '100vw', overflowX: 'auto', height: '100vh' }}>
    <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          {fields.map(field => (
            <TableCell sx={{ width: field.columnWidth }} key={field.name}>
              {field.name}
              {field.isMandatory ? '*' : ''}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {acceptingStores.map(acceptingStore => (
          <StoreTableEntry
            key={acceptingStore.data.name}
            fields={fields}
            storeEntry={Object.values(acceptingStore.data)}
          />
        ))}
      </TableBody>
    </Table>
  </Stack>
)

export default StoresTable
