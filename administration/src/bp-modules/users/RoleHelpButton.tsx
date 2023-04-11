import { Button, H4 } from '@blueprintjs/core'
import { Popover2 } from '@blueprintjs/popover2'

import { Role } from '../../generated/graphql'
import { roleToText } from './UsersTable'

const RoleHelpButton = () => {
  return (
    <Popover2
      content={
        <div style={{ padding: '10px' }}>
          <H4 style={{ textAlign: 'center' }}>Welche Rollen haben welche Berechtigungen?</H4>
          <ul>
            <li>
              <b>{roleToText(Role.ProjectAdmin)}:</b>
              <ul>
                <li>Kann verwaltende Benutzer in allen Regionen verwalten.</li>
              </ul>
            </li>
            <li>
              <b>{roleToText(Role.RegionAdmin)}:</b>
              <ul>
                <li>Kann verwaltende Benutzer in seiner Region verwalten.</li>
                <li>Kann digitale Karten in seiner Region erstellen.</li>
                <li>Kann Anträge in seiner Region verwalten.</li>
              </ul>
            </li>
            <li>
              <b>{roleToText(Role.RegionManager)}:</b>
              <ul>
                <li>Kann digitale Karten in seiner Region erstellen.</li>
                <li>Kann Anträge in seiner Region verwalten.</li>
              </ul>
            </li>
          </ul>
        </div>
      }>
      <Button icon='help' minimal />
    </Popover2>
  )
}

export default RoleHelpButton
