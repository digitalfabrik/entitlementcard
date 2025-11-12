import { Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, getValueByCSVHeader, isValueValid } from '../../cards/Card'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { getCsvHeaders } from '../../project-configs/helper'

const CardImportTable = ({ cards }: { cards: Card[] }): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const { card: cardConfig } = projectConfig
  const csvHeaders = getCsvHeaders(projectConfig)
  const { t } = useTranslation('cards')

  return (
    <Stack alignItems='center' flexGrow={1} sx={{ overflow: 'auto', marginTop: 2 }}>
      <Table sx={{ maxWidth: 860 }} size='small' stickyHeader>
        <TableHead>
          <TableRow>
            {csvHeaders.map(name => (
              <TableCell key={name} sx={{ whiteSpace: 'no-wrap' }}>
                {name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {cards.map(card => (
            <TableRow key={card.id}>
              {csvHeaders.map(header => {
                const isValid = isValueValid(card, cardConfig, header)
                const value = getValueByCSVHeader(card, cardConfig, header)?.toString() || '-'

                return (
                  <Tooltip key={header} title={!isValid ? t('validationError') : undefined}>
                    <TableCell
                      sx={theme => ({
                        backgroundColor: isValid ? undefined : theme.palette.error.light,
                        whiteSpace: 'break-spaces',
                        verticalAlign: 'top',
                      })}>
                      {value}
                    </TableCell>
                  </Tooltip>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}

export default CardImportTable
