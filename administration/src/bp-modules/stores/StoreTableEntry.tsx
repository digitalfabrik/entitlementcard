import { TableCell, TableRow, Tooltip } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { StoresFieldConfig } from '../../project-configs/getProjectConfig'

type StoreEntryProps = {
  storeEntry: string[]
  fields: StoresFieldConfig[]
}

const StoreTableEntry = ({ storeEntry, fields }: StoreEntryProps): ReactElement => {
  const { t } = useTranslation('stores')
  return (
    <TableRow>
      {storeEntry.map((value, columnIndex) => {
        const field = fields[columnIndex]
        const isValid = field.isValid(value)
        const fieldValue = value.trim().length > 0 ? value : '-'
        return (
          <Tooltip placement='right' key={field.name} title={isValid ? fieldValue : t('validationError')}>
            <TableCell
              sx={theme => ({
                backgroundColor: isValid ? undefined : theme.palette.error.light,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              })}>
              {fieldValue}
            </TableCell>
          </Tooltip>
        )
      })}
    </TableRow>
  )
}

export default StoreTableEntry
