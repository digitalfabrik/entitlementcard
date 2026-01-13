import { styled } from '@mui/system'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { ActivityLogConfig } from '../../../project-configs/getProjectConfig'
import { ActivityLogEntryType } from '../utils/activityLog'

const StickyTableHeader = styled('thead')`
  position: sticky;
  top: 0;
  z-index: 2;
`

const EmptyLogColumn = styled('td')(({ theme }) => ({
  padding: theme.spacing(1.5),
}))

const EmptyLogRow = styled('tr')`
  &:hover {
    background-color: transparent !important;
  },
`

const StyledTable = styled('table')(({ theme }) => ({
  borderSpacing: '0',
  minWidth: 800,
  overflowX: 'hidden',
  '& tbody tr:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& td, & th': {
    margin: 0,
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  '& th': {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

type ActivityLogTableProps = {
  activityLog: ActivityLogEntryType[]
  activityLogConfig: ActivityLogConfig
}

const ActivityLogTable = ({
  activityLog,
  activityLogConfig,
}: ActivityLogTableProps): ReactElement => {
  const { t } = useTranslation('activityLog')
  return (
    <StyledTable>
      <StickyTableHeader>
        <tr>
          {activityLogConfig.columnNames.map(columnName => (
            <th key={columnName}>{columnName}</th>
          ))}
        </tr>
      </StickyTableHeader>
      <tbody>
        {activityLog.length > 0 ? (
          activityLog.map(activityLogConfig.renderLogEntry)
        ) : (
          <EmptyLogRow>
            <EmptyLogColumn colSpan={999}>{t('noEntries')}</EmptyLogColumn>
          </EmptyLogRow>
        )}
      </tbody>
    </StyledTable>
  )
}

export default ActivityLogTable
