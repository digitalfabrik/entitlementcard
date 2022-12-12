import { Button, ButtonGroup } from '@blueprintjs/core'
import styled from 'styled-components'
import { Administrator, Region, Role } from '../../generated/graphql'
import { useAppToaster } from '../AppToaster'

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

const UsersTable = ({
  users,
  regions,
  showRegion,
}: {
  users: Administrator[]
  regions: Region[]
  showRegion: boolean
}) => {
  const appToaster = useAppToaster()

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
            <th>E-Mail Adresse</th>
            {showRegion ? <th>Region</th> : null}
            <th>Rolle</th>
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
        <Button intent='success' text='Benutzer hinzufügen' icon='add' onClick={showNotImplementedToast} />
      </div>
    </>
  )
}

const roleToText = (role: Role): String => {
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
