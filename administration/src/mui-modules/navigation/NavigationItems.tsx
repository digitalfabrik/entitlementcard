import { AddCard, Analytics, Checklist, Inventory, Map, People, Place } from '@mui/icons-material'
import { Button, ButtonPropsVariantOverrides } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import RenderGuard from '../components/RenderGuard'

type NavigationItemsProps = {
  variant: OverridableStringUnion<'text' | 'outlined' | 'contained', ButtonPropsVariantOverrides> | undefined
}

const NavigationItems = ({ variant }: NavigationItemsProps): ReactElement => {
  const { t } = useTranslation('misc')
  const config = useContext(ProjectConfigContext)
  const { role } = useWhoAmI().me
  const canSeeProjectSettings =
    (role === Role.ProjectAdmin && config.userImportApiEnabled) || role === Role.ExternalVerifiedApiUser

  return (
    <>
      <RenderGuard allowedRoles={[Role.RegionAdmin, Role.RegionManager]}>
        {config.applicationFeature ? (
          <NavLink to='/applications'>
            <Button variant={variant} startIcon={<Checklist />}>
              {t('inComingApplications')}
            </Button>
          </NavLink>
        ) : null}
        {config.cardCreation ? (
          <NavLink to='/cards'>
            <Button variant={variant} startIcon={<AddCard />}>
              {t('createCards')}
            </Button>
          </NavLink>
        ) : null}
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.RegionAdmin, Role.ProjectAdmin]}>
        <NavLink to='/users'>
          <Button variant={variant} startIcon={<People />}>
            {t('manageUsers')}
          </Button>
        </NavLink>
        {config.cardStatistics.enabled ? (
          <NavLink to='/statistics'>
            <Button variant={variant} startIcon={<Analytics />}>
              {t('statistics')}
            </Button>
          </NavLink>
        ) : null}
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.RegionAdmin]} condition={config.applicationFeature !== undefined}>
        <NavLink to='/region'>
          <Button variant={variant} startIcon={<Map />}>
            {t('manageRegion')}
          </Button>
        </NavLink>
      </RenderGuard>

      <RenderGuard condition={canSeeProjectSettings}>
        <NavLink to='/project'>
          <Button variant={variant} startIcon={<Inventory />}>
            {t('manageProject')}
          </Button>
        </NavLink>
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.ProjectStoreManager]}>
        <NavLink to='/stores'>
          <Button variant={variant} startIcon={<Place />}>
            {t('manageStores')}
          </Button>
        </NavLink>
      </RenderGuard>
    </>
  )
}

export default NavigationItems
