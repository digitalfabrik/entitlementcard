import { Button, H3 } from '@blueprintjs/core'
import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'
import styled from 'styled-components'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const StyledButton = styled(Button)`
  margin: 10px;
`

const HomeController = (): ReactElement => {
  const { applicationFeature, cardStatistics, cardCreation, userImportApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  const { t } = useTranslation('home')

  return (
    <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: 4, gap: 2 }}>
      <H3>Wählen Sie eine Aktion aus:</H3>
      <RenderGuard allowedRoles={[Role.RegionAdmin, Role.RegionManager]}>
        {applicationFeature ? (
          <NavLink to='/applications'>
            <StyledButton icon='form' text={t('incomingApplications')} />
          </NavLink>
        ) : null}
        {cardCreation ? (
          <NavLink to='/cards'>
            <StyledButton icon='id-number' text={t('createCards')} />
          </NavLink>
        ) : null}
      </RenderGuard>
      <RenderGuard allowedRoles={[Role.RegionAdmin, Role.ProjectAdmin]}>
        <NavLink to='/users'>
          <StyledButton icon='people' text={t('administerUsers')} />
        </NavLink>
        {cardStatistics.enabled ? (
          <NavLink to='/statistics'>
            <StyledButton icon='stacked-chart' text={t('statistics')} />
          </NavLink>
        ) : null}
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.RegionAdmin]} condition={applicationFeature !== undefined}>
        <NavLink to='/region'>
          <StyledButton icon='path-search' text={t('administerRegions')} />
        </NavLink>
      </RenderGuard>

      <RenderGuard
        condition={(role === Role.ProjectAdmin && userImportApiEnabled) || role === Role.ExternalVerifiedApiUser}>
        <NavLink to='/project'>
          <StyledButton icon='projects' text={t('administerProjects')} />
        </NavLink>
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.ProjectStoreManager]}>
        <NavLink to='/stores'>
          <StyledButton icon='shop' text={t('administerStores')} />
        </NavLink>
      </RenderGuard>
    </Stack>
  )
}

export default HomeController
