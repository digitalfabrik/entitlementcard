import { Card, H2 } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ActivityLogConfig } from '../../project-configs/getProjectConfig'
import { loadActivityLog } from './ActivityLog'
import ActivityLogTable from './ActivityLogTable'

const ActivityLogContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const ActivityLogCard = styled(Card)`
  max-width: 840px;
  margin: 16px;
`

const DescriptionText = styled.p`
  padding: 10px 0;
`

const ActivityLogController = ({ activityLogConfig }: { activityLogConfig: ActivityLogConfig }): ReactElement => {
  const { t } = useTranslation('activityLog')
  const { card: cardConfig } = useContext(ProjectConfigContext)
  const activityLogSorted = loadActivityLog(cardConfig).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))

  return (
    <RenderGuard
      allowedRoles={[Role.RegionAdmin, Role.RegionManager]}
      error={{ description: t('errors:notAuthorizedToSeeActivityLog') }}>
      <ActivityLogContainer>
        <ActivityLogCard>
          <H2>{t('misc:activityLog')}</H2>
          <DescriptionText>{t('activityLogDescription')}</DescriptionText>
          <ActivityLogTable activityLog={activityLogSorted} activityLogConfig={activityLogConfig} />
        </ActivityLogCard>
      </ActivityLogContainer>
    </RenderGuard>
  )
}

export default ActivityLogController
