import React, { useContext } from 'react'
import { Button, Navbar } from '@blueprintjs/core'
import { NavLink } from 'react-router-dom'
import { Alignment } from '@blueprintjs/core/lib/esm/common/alignment'
import { RegionContext } from '../RegionProvider'
import { AuthContext } from '../AuthProvider'
import { Role } from '../generated/graphql'
import { ProjectConfigContext } from '../project-configs/ProjectConfigContext'

interface Props {
  onSignOut: () => void
}

const Navigation = (props: Props) => {
  const config = useContext(ProjectConfigContext)
  const region = useContext(RegionContext)
  const role = useContext(AuthContext).data?.administrator.role
  return (
    <Navbar style={{ height: 'auto' }}>
      <Navbar.Group>
        <Navbar.Heading>
          <NavLink to={'/'} style={{ color: 'black', textDecoration: 'none', display: 'block' }}>
            <div style={{ flexDirection: 'column' }}>{config.name} Verwaltung</div>
            {region === null ? null : (
              <span>
                {region.prefix} {region.name}
              </span>
            )}
          </NavLink>
        </Navbar.Heading>
        <Navbar.Divider />
        {role === Role.RegionAdmin || role === Role.RegionManager ? (
          <>
            {!config.applicationFeatureEnabled ? null : (
              <NavLink to={'/applications'}>
                <Button minimal icon='form' text='Eingehende Anträge' />
              </NavLink>
            )}
            <NavLink to={'/create-cards'}>
              <Button minimal icon='id-number' text='Karten erstellen' />
            </NavLink>
          </>
        ) : null}
        {role === Role.ProjectAdmin || role === Role.RegionAdmin ? (
          <NavLink to={'/users'}>
            <Button minimal icon='people' text='Benutzer verwalten' />
          </NavLink>
        ) : null}
        {role === Role.RegionAdmin && config.applicationFeatureEnabled ? (
          <NavLink to={'/region'}>
            <Button minimal icon='path-search' text='Region verwalten' />
          </NavLink>
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
