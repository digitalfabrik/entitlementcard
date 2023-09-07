import { Button, Menu, Popover } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { WhoAmIContext } from '../WhoAmIProvider'
import { roleToText } from './users/UsersTable'

type UserMenuProps = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
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

const UserMenuButton = styled(Button)`
  display: inline-block;
  width: 100%;
`

const UserMenu = ({ isOpen, setIsOpen, onSignOut }: UserMenuProps): ReactElement => {
  const { role, email } = useContext(WhoAmIContext).me!
  const navigate = useNavigate()
  const signOutAndRedirect = () => {
    onSignOut()
    navigate('/')
  }
  const userMenuContent = (
    <MenuContent onClick={() => setIsOpen(false)}>
      <span className='bp5-tag bp5-large'>{`Rolle: ${roleToText(role)}`}</span>
      <NavLink to={'/user-settings'}>
        <UserMenuButton minimal icon='settings' text='Benutzereinstellungen' />
      </NavLink>
      <UserMenuButton minimal icon='log-out' text='Logout' onClick={signOutAndRedirect} />
    </MenuContent>
  )
  return (
    <>
      <Popover content={userMenuContent} placement='bottom' matchTargetWidth isOpen={isOpen} onInteraction={setIsOpen}>
        <Button minimal alignText='left' icon='user' rightIcon={isOpen ? 'caret-up' : 'caret-down'} text={email} />
      </Popover>
      <Backdrop onClick={() => setIsOpen(false)} isOpen={isOpen} />
    </>
  )
}

export default UserMenu
