/* eslint-disable react/destructuring-assignment */
import { Alignment, Navbar } from '@blueprintjs/core'
import { AddCard, Analytics, Checklist, Inventory, Map, People, Place } from '@mui/icons-material'
import { Button, ButtonProps, styled } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { useWhoAmI } from '../WhoAmIProvider'
import { Role } from '../generated/graphql'
import RenderGuard from '../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import UserMenu from './UserMenu'
import dimensions from './constants/dimensions'

const PrintAwareNavbar = styled(Navbar)`
  @media print {
    display: none;
  }
  height: ${dimensions.navigationBarHeight};
`

const MenuButton = (p: ButtonProps) => (
  <Button variant='text' {...p} color='default'>
    {p.children}
  </Button>
)

type Props = {
  onSignOut: () => void
}

const Navigation = ({ onSignOut }: Props): ReactElement => {
  const { t } = useTranslation('misc')
  const config = useContext(ProjectConfigContext)
  const { region, role } = useWhoAmI().me
  const canSeeProjectSettings =
    (role === Role.ProjectAdmin && config.userImportApiEnabled) || role === Role.ExternalVerifiedApiUser

  return (
    <PrintAwareNavbar style={{ height: 'auto' }}>
      <Navbar.Group>
        <Navbar.Heading>
          <NavLink to='/' style={{ color: 'black', textDecoration: 'none', display: 'block' }}>
            <div style={{ flexDirection: 'column' }}>
              {config.name} {t('administration')}
            </div>
            {!region ? null : (
              <span>
                {region.prefix} {region.name} {`(${process.env.REACT_APP_VERSION})`}
              </span>
            )}
          </NavLink>
        </Navbar.Heading>
        <Navbar.Divider />

        <RenderGuard allowedRoles={[Role.RegionAdmin, Role.RegionManager]}>
          {config.applicationFeature ? (
            <NavLink to='/applications'>
              <MenuButton startIcon={<Checklist />}>{t('inComingApplications')}</MenuButton>
            </NavLink>
          ) : null}
          {config.cardCreation ? (
            <NavLink to='/cards'>
              <MenuButton startIcon={<AddCard />}>{t('createCards')}</MenuButton>
            </NavLink>
          ) : null}
        </RenderGuard>

        <RenderGuard allowedRoles={[Role.RegionAdmin, Role.ProjectAdmin]}>
          <NavLink to='/users'>
            <MenuButton startIcon={<People />}>{t('manageUsers')}</MenuButton>
          </NavLink>
          {config.cardStatistics.enabled ? (
            <NavLink to='/statistics'>
              <MenuButton startIcon={<Analytics />}>{t('statistics')}</MenuButton>
            </NavLink>
          ) : null}
        </RenderGuard>

        <RenderGuard allowedRoles={[Role.RegionAdmin]} condition={config.applicationFeature !== undefined}>
          <NavLink to='/region'>
            <MenuButton startIcon={<Map />}>{t('manageRegion')}</MenuButton>
          </NavLink>
        </RenderGuard>

        <RenderGuard condition={canSeeProjectSettings}>
          <NavLink to='/project'>
            <MenuButton startIcon={<Inventory />}>{t('manageProject')}</MenuButton>
          </NavLink>
        </RenderGuard>

        <RenderGuard allowedRoles={[Role.ProjectStoreManager]}>
          <NavLink to='/stores'>
            <MenuButton startIcon={<Place />}>{t('manageStores')}</MenuButton>
          </NavLink>
        </RenderGuard>
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <UserMenu onSignOut={onSignOut} />
      </Navbar.Group>
    </PrintAwareNavbar>
  )
}

export default Navigation
