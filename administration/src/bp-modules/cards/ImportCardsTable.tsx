import { Cell, Column, Table2, TruncatedFormat2 } from '@blueprintjs/table'
import '@blueprintjs/table/lib/css/table.css'
import React, { ReactElement, useCallback } from 'react'
import styled from 'styled-components'

import CSVCard from '../../cards/CSVCard'
import { CardBlueprint } from '../../cards/CardBlueprint'

type CardImportTableProps = {
  headers: string[]
  cardBlueprints: CardBlueprint[]
}

const TableContainer = styled.div`
  overflow: auto;
  justify-content: center;
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
`

const StyledCell = styled(Cell)`
  font-size: 0.85rem;
  white-space: break-spaces;
`

const CardImportTable = ({ headers, cardBlueprints }: CardImportTableProps): ReactElement => {
  const cellRenderer = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const cardBlueprint = cardBlueprints[rowIndex] as CSVCard
      const header = headers[columnIndex]
      const valid = cardBlueprint.isValueValid(header)
      const value = cardBlueprint.getValue(header)
      return (
        <StyledCell
          wrapText
          key={`${rowIndex}-${columnIndex}`}
          tooltip={!valid ? 'Validierungsfehler' : undefined}
          intent={!valid ? 'danger' : 'none'}>
          <TruncatedFormat2 detectTruncation preformatted>
            {value || '-'}
          </TruncatedFormat2>
        </StyledCell>
      )
    },
    [cardBlueprints, headers]
  )

  return (
    <TableContainer>
      <Table2 numRows={cardBlueprints.length} enableGhostCells minRowHeight={16}>
        {headers.map(name => (
          <Column key={name} name={name} cellRenderer={cellRenderer} />
        ))}
      </Table2>
    </TableContainer>
  )
}

export default CardImportTable
