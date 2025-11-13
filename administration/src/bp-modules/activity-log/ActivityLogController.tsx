import { Card, Stack, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ActivityLogConfig } from '../../project-configs/getProjectConfig'
import { loadActivityLog } from './ActivityLog'
import ActivityLogTable from './ActivityLogTable'

const ActivityLogController = ({ activityLogConfig }: { activityLogConfig: ActivityLogConfig }): ReactElement => {
  const { t } = useTranslation('activityLog')
  const { card: cardConfig } = useContext(ProjectConfigContext)
  const activityLogSorted = loadActivityLog(cardConfig).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

  return (
    <RenderGuard
      allowedRoles={[Role.RegionAdmin, Role.RegionManager]}
      error={{ description: t('errors:notAuthorizedToSeeActivityLog') }}>
      <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'safe center' }}>
        <Card sx={{ maxWidth: '850px', p: 2, flexGrow: 1, overflow: 'auto' }}>
          <Typography variant='h4'>{t('misc:activityLog')}</Typography>
          <Typography component='p' paddingY={1.5}>
            {t('activityLogDescription')}
          </Typography>
          <ActivityLogTable activityLog={activityLogSorted} activityLogConfig={activityLogConfig} />
        </Card>
      </Stack>
    </RenderGuard>
  )
}

export default ActivityLogController
