import { Button } from '@blueprintjs/core'
import { useState } from 'react'
import styled from 'styled-components'
import { Administrator, Region, Role } from '../../generated/graphql'
import CreateUserDialog from './CreateUserDialog'
import RoleHelpButton from './RoleHelpButton'
import EditUserDialog from './EditUserDialog'
import DeleteUserDialog from './DeleteUserDialog'

const StyledTable = styled.table`
  border-spacing: 0;

  & tbody tr:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  & td,
  & th {
    margin: 0;
    padding: 16px;
    text-align: center;
  }

  & th {
    position: sticky;
    top: 0;
    background: white;
    border-bottom: 1px solid lightgray;
  }
`

const UsersTable = ({
  users,
  regions,
  selectedRegionId = null,
  refetch,
}: {
  users: Administrator[]
  regions: Region[]
  // If selectedRegionId is given, the users array is assumed to contain all users of that region.
  // Moreover, the region column of the table is hidden.
  selectedRegionId?: number | null
  refetch: () => void
}) => {
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false)
  const [userInEditDialog, setUserInEditDialog] = useState<Administrator | null>(null)
  const [userInDeleteDialog, setUserInDeleteDialog] = useState<Administrator | null>(null)

  return (
    <>
      <StyledTable>
        <thead>
          <tr>
            <th>Email-Adresse</th>
            {selectedRegionId !== null ? null : <th>Region</th>}
            <th>
              Rolle <RoleHelpButton />
            </th>
            <th>{/* Action Buttons */}</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const region = regions.find(r => r.id === user.regionId)
            const regionName = region === undefined ? null : `${region.prefix} ${region.name}`
            return (
              <tr key={user.id}>
                <td>{user.email}</td>
                {selectedRegionId !== null ? null : <td>{regionName === null ? <i>(Keine)</i> : regionName}</td>}
                <td>{roleToText(user.role)}</td>
                <td>
                  <Button
                    icon='edit'
                    intent='warning'
                    text='Bearbeiten'
                    minimal
                    onClick={() => setUserInEditDialog(user)}
                  />
                  <Button
                    icon='trash'
                    intent='danger'
                    text='Löschen'
                    minimal
                    onClick={() => setUserInDeleteDialog(user)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </StyledTable>
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Button intent='success' text='Benutzer hinzufügen' icon='add' onClick={() => setCreateUserDialogOpen(true)} />
        <CreateUserDialog
          isOpen={createUserDialogOpen}
          onClose={() => setCreateUserDialogOpen(false)}
          onSuccess={refetch}
          regionIdOverride={selectedRegionId}
        />
      </div>
      <EditUserDialog
        selectedUser={userInEditDialog}
        onClose={() => setUserInEditDialog(null)}
        onSuccess={refetch}
        regionIdOverride={selectedRegionId}
      />
      <DeleteUserDialog
        selectedUser={userInDeleteDialog}
        onClose={() => setUserInDeleteDialog(null)}
        onSuccess={refetch}
      />
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
