import { Button, ButtonGroup, Card, Spinner } from '@blueprintjs/core'
import { useContext } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../../AuthProvider'
import { Role, useGetRegionsQuery, useGetUsersInProjectQuery } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'

const UsersTable = styled.table`
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

const RefetchCard = (props: { refetch: () => void }) => {
  return (
    <Card>
      Etwas ist schief gelaufen.
      <Button intent='primary' onClick={() => props.refetch()}>
        Erneut versuchen
      </Button>
    </Card>
  )
}

const ManageProjectUsers = () => {
  const projectId = useContext(ProjectConfigContext).projectId
  const regionsQuery = useGetRegionsQuery({ variables: { project: projectId } })
  const usersQuery = useGetUsersInProjectQuery({ variables: { project: projectId } })

  if (regionsQuery.loading || usersQuery.loading) {
    return <Spinner />
  } else if (!regionsQuery.data || regionsQuery.error) {
    return <RefetchCard refetch={regionsQuery.refetch} />
  } else if (!usersQuery.data || usersQuery.error) {
    return <RefetchCard refetch={usersQuery.refetch} />
  }

  const regions = regionsQuery.data!!.regions
  const users = usersQuery.data!!.users

  return (
    <StandaloneCenter>
      <Card style={{ maxWidth: '800px', margin: '16px' }}>
        <UsersTable>
          <thead>
            <tr>
              <th>E-Mail Adresse</th>
              <th>Region</th>
              <th>Rolle</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.regionId === null ? <i>(Keine)</i> : regions.find(r => r.id === user.regionId)?.name}</td>
                <td>{roleToText(user.role)}</td>
                <td>
                  <ButtonGroup minimal>
                    <Button icon='edit' intent='warning' text='Bearbeiten' minimal />
                    <Button icon='trash' intent='danger' text='Entfernen' minimal />
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </UsersTable>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <Button intent='success' text='Benutzer hinzufügen' icon='add' />
        </div>
      </Card>
    </StandaloneCenter>
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

const ManageRegionUsers = () => null

const ManageUsersController = () => {
  const role = useContext(AuthContext).data!.administrator.role
  if (role === Role.RegionAdmin) {
    return ManageRegionUsers()
  } else if (role === Role.ProjectAdmin) {
    return ManageProjectUsers()
  } else {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>Sie sind nicht berechtigt, Benutzer zu verwalten.</p>
      </div>
    )
  }
}

export default ManageUsersController
