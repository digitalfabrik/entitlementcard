import { Card, H2 } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ActivityLogConfig } from '../../project-configs/getProjectConfig'
import { loadActivityLog } from './ActivityLog'
import ActivityLogTable from './ActivityLogTable'

const ActivityLogController = ({ activityLogConfig }: { activityLogConfig: ActivityLogConfig }): ReactElement => {
  const { t } = useTranslation('activityLog')
  const { card: cardConfig } = useContext(ProjectConfigContext)
  const activityLogSorted = loadActivityLog(cardConfig).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Card style={{ maxWidth: '840px', margin: '16px' }}>
        <H2>{t('misc:activityLog')}</H2>
        <p style={{ padding: '10px 0' }}>{t('activityLogDescription')}</p>
        <ActivityLogTable activityLog={activityLogSorted} activityLogConfig={activityLogConfig} />
      </Card>
    </div>
  )
}

export default ActivityLogController
