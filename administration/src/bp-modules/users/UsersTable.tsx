import { Edit, PersonAdd, PersonRemove } from '@mui/icons-material'
import { Button, Stack, Typography, styled } from '@mui/material'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Administrator, Region } from '../../generated/graphql'
import CreateUserDialog from './CreateUserDialog'
import DeleteUserDialog from './DeleteUserDialog'
import EditUserDialog from './EditUserDialog'
import RoleHelpButton from './RoleHelpButton'
import roleToText from './utils/roleToText'

const StyledTable = styled('table')(({ theme }) => ({
  borderSpacing: '0',
  '& tbody tr:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& td, & th': {
    margin: 0,
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  '& th': {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

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
}): ReactElement => {
  const { t } = useTranslation('users')
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false)
  const [userInEditDialog, setUserInEditDialog] = useState<Administrator | null>(null)
  const [userInDeleteDialog, setUserInDeleteDialog] = useState<Administrator | null>(null)

  return (
    <>
      <StyledTable>
        <thead>
          <tr>
            <Typography fontWeight='bold' variant='body1' component='th'>
              {t('eMail')}
            </Typography>
            {selectedRegionId !== null ? null : <th>{t('region')}</th>}
            <Typography fontWeight='bold' variant='body1' component='th'>
              {t('role')} <RoleHelpButton />
            </Typography>
            <th>{/* Action Buttons */}</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const region = regions.find(r => r.id === user.regionId)
            const regionName = region === undefined ? null : `${region.prefix} ${region.name}`
            return (
              <tr key={user.id}>
                <Typography component='td'>{user.email}</Typography>
                {selectedRegionId !== null ? null : (
                  <Typography component='td'>{regionName === null ? <i>({t('none')})</i> : regionName}</Typography>
                )}
                <Typography component='td'>{roleToText(user.role)}</Typography>
                <td>
                  <Stack sx={{ flexDirection: 'row', gap: 1 }}>
                    <Button startIcon={<Edit />} size='small' onClick={() => setUserInEditDialog(user)}>
                      {t('edit')}
                    </Button>
                    <Button
                      startIcon={<PersonRemove />}
                      color='error'
                      size='small'
                      onClick={() => setUserInDeleteDialog(user)}>
                      {t('delete')}
                    </Button>
                  </Stack>
                </td>
              </tr>
            )
          })}
        </tbody>
      </StyledTable>
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Button startIcon={<PersonAdd />} onClick={() => setCreateUserDialogOpen(true)}>
          {t('addUser')}
        </Button>
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

export default UsersTable
