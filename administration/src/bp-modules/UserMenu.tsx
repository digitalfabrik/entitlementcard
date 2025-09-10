/* eslint-disable react/destructuring-assignment */
import { Divider, Menu, Popover } from '@blueprintjs/core'
import { AccountCircle, ArrowDropDown, ArrowDropUp, EditSquare, Logout, Settings } from '@mui/icons-material'
import { Button, type ButtonProps } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router'
import styled from 'styled-components'

import { useWhoAmI } from '../WhoAmIProvider'
import { Role } from '../generated/graphql'
import RenderGuard from '../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'
import roleToText from './users/utils/roleToText'

type UserMenuProps = {
  onSignOut: () => void
}

const Backdrop = styled.div<{ isOpen: boolean }>`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
`

const MenuContent = styled(Menu)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const MenuButton = (p: ButtonProps): ReactElement => (
  <Button sx={{ width: '100%', justifyContent: 'start' }} variant='text' {...p}>
    {p.children}
  </Button>
)

const RoleInfo = styled.span`
  padding: 5px 10px;
`

const UserMenu = ({ onSignOut }: UserMenuProps): ReactElement => {
  const { role, email } = useWhoAmI().me
  const { t } = useTranslation('misc')
  const projectConfig = useContext(ProjectConfigContext)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const signOutAndRedirect = () => {
    onSignOut()
    navigate('/')
  }

  const userMenuContent = (
    <MenuContent onClick={() => setIsOpen(false)}>
      <RoleInfo>Rolle: {roleToText(role)}</RoleInfo>

      <Divider style={{ margin: '4px 0px' }} />

      <NavLink to='/user-settings'>
        <MenuButton startIcon={<Settings />}>{t('userSettings')}</MenuButton>
      </NavLink>

      <RenderGuard
        condition={projectConfig.activityLogConfig !== undefined}
        allowedRoles={[Role.RegionManager, Role.RegionAdmin]}>
        <NavLink to='/activity-log'>
          <MenuButton startIcon={<EditSquare />}>{t('activityLog')}</MenuButton>
        </NavLink>
      </RenderGuard>

      <MenuButton startIcon={<Logout />} onClick={signOutAndRedirect}>
        {t('logout')}
      </MenuButton>
    </MenuContent>
  )

  return (
    <>
      <Popover content={userMenuContent} placement='bottom' matchTargetWidth isOpen={isOpen} onInteraction={setIsOpen}>
        <Button startIcon={<AccountCircle />} endIcon={isOpen ? <ArrowDropDown /> : <ArrowDropUp />}>
          {email}
        </Button>
      </Popover>
      <Backdrop onClick={() => setIsOpen(false)} isOpen={isOpen} />
    </>
  )
}

export default UserMenu
