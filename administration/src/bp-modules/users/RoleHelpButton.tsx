import { Button, H4, Popover } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

import { Role } from '../../generated/graphql'
import { roleToText } from './UsersTable'

const RoleHelpButton = (): ReactElement => (
  <Popover
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
              <li>Kann regionsspezifische Datenschutzerklärung anpassen.</li>
            </ul>
            <div>
              <span style={{ color: 'red', fontWeight: 'bold' }}>Hinweis: </span>
              Mindestens ein Nutzer pro Region empfohlen.
            </div>
          </li>
          <li>
            <b>{roleToText(Role.RegionManager)}:</b>
            <ul>
              <li>Kann digitale Karten in seiner Region erstellen.</li>
              <li>Kann Anträge in seiner Region verwalten.</li>
            </ul>
          </li>
          <li>
            <b>{roleToText(Role.ExternalVerifiedApiUser)}:</b>
            <ul>
              <li>
                Externer Nutzer (z.B. Verein360) kann Anträge erstellen,
                <br />
                die bereits beim Anlegen automatisch durch die Organisation verifiziert sind.
              </li>
            </ul>
          </li>
        </ul>
      </div>
    }>
    <Button icon='help' minimal />
  </Popover>
)

export default RoleHelpButton
