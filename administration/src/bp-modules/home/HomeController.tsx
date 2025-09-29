import { H3 } from '@blueprintjs/core'
import { AddCard, Analytics, Checklist, Inventory, Map, People, Place } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

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
            <Button startIcon={<Checklist />}>{t('incomingApplications')}</Button>
          </NavLink>
        ) : null}
        {cardCreation ? (
          <NavLink to='/cards'>
            <Button startIcon={<AddCard />}>{t('createCards')}</Button>
          </NavLink>
        ) : null}
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.RegionAdmin, Role.ProjectAdmin]}>
        <NavLink to='/users'>
          <Button startIcon={<People />}>{t('administerUsers')}</Button>
        </NavLink>
        {cardStatistics.enabled ? (
          <NavLink to='/statistics'>
            <Button startIcon={<Analytics />}>{t('statistics')}</Button>
          </NavLink>
        ) : null}
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.RegionAdmin]} condition={applicationFeature !== undefined}>
        <NavLink to='/region'>
          <Button startIcon={<Map />}>{t('administerRegions')}</Button>
        </NavLink>
      </RenderGuard>

      <RenderGuard
        condition={(role === Role.ProjectAdmin && userImportApiEnabled) || role === Role.ExternalVerifiedApiUser}>
        <NavLink to='/project'>
          <Button startIcon={<Inventory />}>{t('administerProjects')}</Button>
        </NavLink>
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.ProjectStoreManager]}>
        <NavLink to='/stores'>
          <Button startIcon={<Place />}>{t('administerStores')}</Button>
        </NavLink>
      </RenderGuard>
    </Stack>
  )
}

export default HomeController
