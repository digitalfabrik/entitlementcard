import { Card, H3, NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { WhoAmIContext } from '../../WhoAmIProvider'
import {
  Region,
  Role,
  useGetRegionsQuery,
  useGetUsersInProjectQuery,
  useGetUsersInRegionQuery,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'
import getQueryResult from '../util/getQueryResult'
import UsersTable from './UsersTable'

const UsersTableContainer = ({ children, title }: { children: ReactElement; title: string }) => (
  <StandaloneCenter>
    <Card style={{ maxWidth: '1200px', margin: '16px' }}>
      <H3 style={{ textAlign: 'center' }}>{title}</H3>
      {children}
    </Card>
  </StandaloneCenter>
)

const ManageProjectUsers = () => {
  const { projectId, name: projectName } = useContext(ProjectConfigContext)
  const regionsQuery = useGetRegionsQuery({ variables: { project: projectId } })
  const usersQuery = useGetUsersInProjectQuery({ variables: { project: projectId } })

  const regionsQueryResult = getQueryResult(regionsQuery)
  const usersQueryResult = getQueryResult(usersQuery)

  if (!regionsQueryResult.successful) {
    return regionsQueryResult.component
  }
  if (!usersQueryResult.successful) {
    return usersQueryResult.component
  }

  const regions = regionsQueryResult.data.regions
  const users = usersQueryResult.data.users

  return (
    <UsersTableContainer title={`Alle Benutzer von '${projectName} - Verwaltung'`}>
      <UsersTable users={users} regions={regions} refetch={usersQuery.refetch} />
    </UsersTableContainer>
  )
}

const ManageRegionUsers = ({ region }: { region: Region }) => {
  const { projectId } = useContext(ProjectConfigContext)
  const regionsQuery = useGetRegionsQuery({ variables: { project: projectId } })
  const usersQuery = useGetUsersInRegionQuery({ variables: { regionId: region.id } })

  const regionsQueryResult = getQueryResult(regionsQuery)
  const usersQueryResult = getQueryResult(usersQuery)

  if (!regionsQueryResult.successful) {
    return regionsQueryResult.component
  }
  if (!usersQueryResult.successful) {
    return usersQueryResult.component
  }

  const regions = regionsQueryResult.data.regions
  const users = usersQueryResult.data.users

  return (
    <UsersTableContainer title={`Alle Verwalter der Region '${region.prefix} ${region.name}'`}>
      <UsersTable users={users} regions={regions} selectedRegionId={region.id} refetch={usersQuery.refetch} />
    </UsersTableContainer>
  )
}

const ManageUsersController = (): ReactElement => {
  const { role, region } = useContext(WhoAmIContext).me!
  if (role === Role.RegionAdmin && region) {
    return <ManageRegionUsers region={region} />
  }
  if (role === Role.ProjectAdmin) {
    return <ManageProjectUsers />
  }
  return (
    <NonIdealState
      icon='cross'
      title='Fehlende Berechtigung'
      description='Sie sind nicht berechtigt, Benutzer zu verwalten.'
    />
  )
}

export default ManageUsersController
