import { AddCard, Analytics, Checklist, Inventory, Map, People, Place } from '@mui/icons-material'
import { Button, ButtonPropsVariantOverrides } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

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
          <Button href='/applications' variant={variant} startIcon={<Checklist />}>
            {t('inComingApplications')}
          </Button>
        ) : null}
        {config.cardCreation ? (
          <Button href='/cards' variant={variant} startIcon={<AddCard />}>
            {t('createCards')}
          </Button>
        ) : null}
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.RegionAdmin, Role.ProjectAdmin]}>
        <Button href='/users' variant={variant} startIcon={<People />}>
          {t('manageUsers')}
        </Button>
        {config.cardStatistics.enabled ? (
          <Button href='/statistics' variant={variant} startIcon={<Analytics />}>
            {t('statistics')}
          </Button>
        ) : null}
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.RegionAdmin]} condition={config.applicationFeature !== undefined}>
        <Button href='/region' variant={variant} startIcon={<Map />}>
          {t('manageRegion')}
        </Button>
      </RenderGuard>

      <RenderGuard condition={canSeeProjectSettings}>
        <Button href='/project' variant={variant} startIcon={<Inventory />}>
          {t('manageProject')}
        </Button>
      </RenderGuard>

      <RenderGuard allowedRoles={[Role.ProjectStoreManager]}>
        <Button href='/stores' variant={variant} startIcon={<Place />}>
          {t('manageStores')}
        </Button>
      </RenderGuard>
    </>
  )
}

export default NavigationItems
