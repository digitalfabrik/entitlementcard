import { Button, ButtonGroup, H4 } from '@blueprintjs/core'
import { Popover2 } from '@blueprintjs/popover2'
import { useState } from 'react'
import styled from 'styled-components'
import { Administrator, Region, Role } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'
import CreateUserDialog from './CreateUserDialog'

const StyledTable = styled.table`
  border-spacing: 0;

  & tbody tr:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  & td,
  & th {
    margin: 0;
    padding: 16px;
  }
`

const RoleHelpButton = () => {
  return (
    <Popover2
      content={
        <div style={{ padding: '10px' }}>
          <H4 style={{ textAlign: 'center' }}>Welche Rollen haben welche Berechtigungen?</H4>
          <ul>
            <li>
              <b>Administrator:</b>
              <ul>
                <li>Kann verwaltende Benutzer in allen Regionen verwalten.</li>
              </ul>
            </li>
            <li>
              <b>Regionsadministrator:</b>
              <ul>
                <li>Kann verwaltende Benutzer in seiner Region verwalten.</li>
                <li>Kann digitale Karten in seiner Region erstellen.</li>
                <li>Kann Anträge in seiner Region verwalten.</li>
              </ul>
            </li>
            <li>
              <b>Regionsverwalter:</b>
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

const UsersTable = ({
  users,
  regions,
  showRegion,
  refetch,
}: {
  users: Administrator[]
  regions: Region[]
  showRegion: boolean
  refetch: () => void
}) => {
  const appToaster = useAppToaster()
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false)

  const showNotImplementedToast = () =>
    appToaster?.show({
      message: 'Diese Funktion ist noch nicht verfügbar!',
      intent: 'danger',
    })

  return (
    <>
      <StyledTable>
        <thead>
          <tr>
            <th>Email-Adresse</th>
            {showRegion ? <th>Region</th> : null}
            <th>
              Rolle <RoleHelpButton />
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              {showRegion ? (
                <td>{user.regionId === null ? <i>(Keine)</i> : regions.find(r => r.id === user.regionId)?.name}</td>
              ) : null}
              <td>{roleToText(user.role)}</td>
              <td>
                <ButtonGroup minimal>
                  <Button icon='edit' intent='warning' text='Bearbeiten' minimal onClick={showNotImplementedToast} />
                  <Button icon='trash' intent='danger' text='Entfernen' minimal onClick={showNotImplementedToast} />
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Button intent='success' text='Benutzer hinzufügen' icon='add' onClick={() => setCreateUserDialogOpen(true)} />
        <CreateUserDialog
          isOpen={createUserDialogOpen}
          onClose={() => setCreateUserDialogOpen(false)}
          onSuccess={refetch}
        />
      </div>
    </>
  )
}

export const roleToText = (role: Role): String => {
  switch (role) {
    case Role.NoRights:
      return 'Keine'
    case Role.ProjectAdmin:
      return 'Administrator'
    case Role.RegionAdmin:
      return 'Regionsadministrator'
    case Role.RegionManager:
      return 'Regionsverwalter'
    default:
      return role
  }
}

export default UsersTable
