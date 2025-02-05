import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ActivityLogConfig } from '../../project-configs/getProjectConfig'
import { ActivityLogEntryType } from './ActivityLog'

const StickyTableHeader = styled.thead`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
`

const EmptyLogColumn = styled.td`
  padding: 12px;
`

const EmptyLogRow = styled.tr`
  &:hover {
    background-color: transparent !important;
  }
`

const StyledTable = styled.table`
  border-spacing: 0;
  min-width: 800px;
  overflow-x: hidden;

  & tbody tr:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  & td,
  & th {
    margin: 0;
    padding: 16px;
    text-align: center;
  }

  & th {
    position: sticky;
    top: 0;
    background: white;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
  }
`

type ActivityLogTableProps = {
  activityLog: ActivityLogEntryType[]
  activityLogConfig: ActivityLogConfig
}

const ActivityLogTable = ({ activityLog, activityLogConfig }: ActivityLogTableProps): ReactElement => {
  const { t } = useTranslation('userSettings')
  return (
    <StyledTable>
      <StickyTableHeader>
        <tr data-testid='activity-log-column-names'>
          {activityLogConfig.columnNames.map(columnName => (
            <th key={columnName}>{columnName}</th>
          ))}
        </tr>
      </StickyTableHeader>
      <tbody data-testid='activity-log-table-body'>
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
