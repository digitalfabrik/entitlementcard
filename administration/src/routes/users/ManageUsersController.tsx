import { Card, Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import AlertBox from '../../components/AlertBox'
import CenteredStack from '../../components/CenteredStack'
import {
  GetRegionsDocument,
  GetUsersInProjectDocument,
  GetUsersInRegionDocument,
  Role,
  WhoAmIQuery,
} from '../../graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import getQueryResult from '../../util/getQueryResult'
import UsersTable from './components/UsersTable'

type Region = NonNullable<WhoAmIQuery['me']['region']>

const UsersTableContainer = ({ children, title }: { children: ReactElement; title: string }) => (
  <CenteredStack>
    <Card sx={{ maxWidth: '1200px', padding: 2 }}>
      <Typography variant='h5' sx={{ textAlign: 'center', marginY: 1 }}>
        {title}
      </Typography>
      {children}
    </Card>
  </CenteredStack>
)

const ManageProjectUsers = () => {
  const { projectId, name: projectName } = useContext(ProjectConfigContext)
  const { t } = useTranslation('users')
  const [regionsState, regionsQuery] = useQuery({
    query: GetRegionsDocument,
    variables: { project: projectId },
  })
  const [usersState, usersQuery] = useQuery({ query: GetUsersInProjectDocument })

  const regionsQueryResult = getQueryResult(regionsState, regionsQuery)
  const usersQueryResult = getQueryResult(usersState, usersQuery)

  if (!regionsQueryResult.successful) {
    return regionsQueryResult.component
  }
  if (!usersQueryResult.successful) {
    return usersQueryResult.component
  }

  const regions = regionsQueryResult.data.regions
  const users = usersQueryResult.data.users

  return (
    <UsersTableContainer title={t('allUsersOfProject', { projectName })}>
      <UsersTable
        users={users}
        regions={regions}
        refetch={() => usersQuery({ requestPolicy: 'network-only' })}
      />
    </UsersTableContainer>
  )
}

const ManageRegionUsers = ({ region }: { region: Region }) => {
  const { projectId } = useContext(ProjectConfigContext)
  const { t } = useTranslation('users')
  // TODO Crate a query that includes both regions and users
  const [regionsState, regionsQuery] = useQuery({
    query: GetRegionsDocument,
    variables: { project: projectId },
  })
  const [usersState, usersQuery] = useQuery({
    query: GetUsersInRegionDocument,
    variables: { regionId: region.id },
  })

  const regionsQueryResult = getQueryResult(regionsState, regionsQuery)
  const usersQueryResult = getQueryResult(usersState, usersQuery)

  if (!regionsQueryResult.successful) {
    return regionsQueryResult.component
  }
  if (!usersQueryResult.successful) {
    return usersQueryResult.component
  }

  const regions = regionsQueryResult.data.regions
  const users = usersQueryResult.data.users

  return (
    <UsersTableContainer
      title={t('allUsersOfRegion', { prefix: region.prefix, name: region.name })}
    >
      <UsersTable
        users={users}
        regions={regions}
        selectedRegionId={region.id}
        refetch={() => usersQuery({ requestPolicy: 'network-only' })}
      />
    </UsersTableContainer>
  )
}

const ManageUsersController = (): ReactElement => {
  const { t } = useTranslation('errors')
  const { role, region } = useWhoAmI().me

  if (role === Role.RegionAdmin && region) {
    return <ManageRegionUsers region={region} />
  }
  if (role === Role.ProjectAdmin) {
    return <ManageProjectUsers />
  }
  return (
    <AlertBox
      severity='error'
      title={t('notAuthorized')}
      description={t('notAuthorizedToManageUsers')}
    />
  )
}

export default ManageUsersController
