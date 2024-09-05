import { Cell, Column, Table2, TruncatedFormat } from '@blueprintjs/table'
import '@blueprintjs/table/lib/css/table.css'
import { ReactElement, useCallback } from 'react'
import styled from 'styled-components'

import { StoreFieldConfig } from '../../project-configs/getProjectConfig'
import { AcceptingStoreEntry } from './AcceptingStoreEntry'

const TableContainer = styled.div`
  width: 100vw;
  height: 85vh;
  display: flex;
  align-self: center;
`

const StyledCell = styled(Cell)`
  font-size: 0.85rem;
  white-space: break-spaces;
`

type CardImportTableProps = {
  fields: StoreFieldConfig[]
  acceptingStores: AcceptingStoreEntry[]
}

const StoresTable = ({ fields, acceptingStores }: CardImportTableProps): ReactElement => {
  const headers = fields.map(field => field.name)
  const cellRenderer = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const acceptingStore = acceptingStores[rowIndex]
      const header = headers[columnIndex]
      const value = acceptingStore.data[header]
      const valid = fields[columnIndex].isValid(value)

      return (
        <StyledCell
          wrapText
          key={`${rowIndex}-${columnIndex}`}
          tooltip={valid ? undefined : 'Validierungsfehler'}
          intent={valid ? 'none' : 'danger'}>
          <TruncatedFormat detectTruncation preformatted>
            {/* This is necessary, can be removed once "noUncheckedIndexedAccess" is enabled in tsconfig  */}
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
            {value ?? '-'}
          </TruncatedFormat>
        </StyledCell>
      )
    },
    [acceptingStores, fields, headers]
  )

  return (
    <TableContainer>
      <Table2
        numRows={acceptingStores.length}
        minRowHeight={12}
        enableGhostCells
        columnWidths={fields.map(field => field.columnWidth)}>
        {fields.map((field, idx) => (
          <Column key={idx} name={`${field.name}${field.isMandatory ? '*' : ''}`} cellRenderer={cellRenderer} />
        ))}
      </Table2>
    </TableContainer>
  )
}

export default StoresTable
