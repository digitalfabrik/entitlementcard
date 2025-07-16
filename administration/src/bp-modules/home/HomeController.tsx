import { Button, H3 } from '@blueprintjs/core'
import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const HomeController = (): ReactElement => {
  const { applicationFeature, cardStatistics, cardCreation, userImportApiEnabled } = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  const { t } = useTranslation('home')

  return (
    <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: 4, gap: 2 }}>
      <H3>Wählen Sie eine Aktion aus:</H3>
      {role === Role.RegionAdmin || role === Role.RegionManager ? (
        <>
          {applicationFeature ? (
            <NavLink to='/applications'>
              <Button icon='form' text={t('incomingApplications')} />
            </NavLink>
          ) : null}
          {cardCreation ? (
            <NavLink to='/cards'>
              <Button icon='id-number' text={t('createCards')} />
            </NavLink>
          ) : null}
        </>
      ) : null}
      {role === Role.ProjectAdmin || role === Role.RegionAdmin ? (
        <>
          <NavLink to='/users'>
            <Button icon='people' text={t('administerUsers')} />
          </NavLink>
          {cardStatistics.enabled ? (
            <NavLink to='/statistics'>
              <Button icon='stacked-chart' text={t('statistics')} />
            </NavLink>
          ) : null}
        </>
      ) : null}
      {role === Role.RegionAdmin && applicationFeature ? (
        <NavLink to='/region'>
          <Button icon='path-search' text={t('administerRegions')} />
        </NavLink>
      ) : null}
      {(role === Role.ProjectAdmin && userImportApiEnabled) || role === Role.ExternalVerifiedApiUser ? (
        <NavLink to='/project'>
          <Button icon='projects' text={t('administerProjects')} />
        </NavLink>
      ) : null}
      {role === Role.ProjectStoreManager ? (
        <NavLink to='/stores'>
          <Button icon='shop' text={t('administerStores')} />
        </NavLink>
      ) : null}
    </Stack>
  )
}

export default HomeController
