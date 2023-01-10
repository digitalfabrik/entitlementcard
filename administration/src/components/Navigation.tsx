import React, { useContext } from 'react'
import { Button, Navbar } from '@blueprintjs/core'
import { NavLink } from 'react-router-dom'
import { Alignment } from '@blueprintjs/core/lib/esm/common/alignment'
import { WhoAmIContext } from '../WhoAmIProvider'
import { Role } from '../generated/graphql'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'

interface Props {
  onSignOut: () => void
}

const Navigation = (props: Props) => {
  const config = useContext(ProjectConfigContext)
  const { region, role } = useContext(WhoAmIContext).me!
  return (
    <Navbar style={{ height: 'auto' }}>
      <Navbar.Group>
        <Navbar.Heading>{config.name} Verwaltung</Navbar.Heading>
        <Navbar.Divider />
        {region == null ? null : (
          <>
            <span>{region?.name ?? ''}</span>
            <Navbar.Divider />
          </>
        )}
        <NavLink to={'/'}>
          <Button minimal icon='home' text='Home' />
        </NavLink>
        {role === Role.RegionAdmin || role === Role.RegionManager ? (
          <>
            <NavLink to={'/applications'}>
              <Button minimal icon='form' text='Eingehende Anträge' />
            </NavLink>
            <NavLink to={'/create-cards'}>
              <Button minimal icon='id-number' text='Karten erstellen' />
            </NavLink>
          </>
        ) : null}
        {role === Role.ProjectAdmin || role === Role.RegionAdmin ? (
          <>
            <NavLink to={'/users'}>
              <Button minimal icon='people' text='Benutzer verwalten' />
            </NavLink>
          </>
        ) : null}
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <NavLink to={'/user-settings'}>
          <Button minimal icon='settings' text='Benutzereinstellungen' />
        </NavLink>
        <Button minimal icon='log-out' text='Logout' onClick={props.onSignOut} />
      </Navbar.Group>
    </Navbar>
  )
}

export default Navigation
