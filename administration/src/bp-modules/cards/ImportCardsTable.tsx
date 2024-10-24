import { Cell, Column, Table2, TruncatedFormat2 } from '@blueprintjs/table'
import '@blueprintjs/table/lib/css/table.css'
import React, { ReactElement, useCallback } from 'react'
import styled from 'styled-components'

import { CardBlueprint, getValueByCSVHeader, isValueValid } from '../../cards/Card'
import { CardConfig } from '../../project-configs/getProjectConfig'

type CardImportTableProps = {
  headers: string[]
  cardBlueprints: CardBlueprint[]
  cardConfig: CardConfig
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

const CardImportTable = ({ headers, cardBlueprints, cardConfig }: CardImportTableProps): ReactElement => {
  const cellRenderer = useCallback(
    (rowIndex: number, columnIndex: number) => {
      const cardBlueprint = cardBlueprints[rowIndex]
      const header = headers[columnIndex]
      const valid = isValueValid(cardBlueprint, cardConfig, header)
      const value = getValueByCSVHeader(cardBlueprint, cardConfig, header)
      return (
        <StyledCell
          wrapText
          key={`${rowIndex}-${columnIndex}`}
          tooltip={!valid ? 'Validierungsfehler' : undefined}
          intent={!valid ? 'danger' : 'none'}>
          <TruncatedFormat2 detectTruncation preformatted>
            {value?.toString() ?? '-'}
          </TruncatedFormat2>
        </StyledCell>
      )
    },
    [cardConfig, cardBlueprints, headers]
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
