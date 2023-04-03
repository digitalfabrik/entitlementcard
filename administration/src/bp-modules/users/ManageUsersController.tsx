import { Card, H3, NonIdealState, Spinner } from '@blueprintjs/core'
import { ReactElement, useContext } from 'react'
import {
  Region,
  Role,
  useGetRegionsQuery,
  useGetUsersInProjectQuery,
  useGetUsersInRegionQuery,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'
import UsersTable from './UsersTable'
import { WhoAmIContext } from '../../WhoAmIProvider'
import ErrorHandler from '../ErrorHandler'

const UsersTableContainer = ({ children, title }: { children: ReactElement; title: string }) => {
  return (
    <StandaloneCenter>
      <Card style={{ maxWidth: '1200px', margin: '16px' }}>
        <H3 style={{ textAlign: 'center' }}>{title}</H3>
        {children}
      </Card>
    </StandaloneCenter>
  )
}

const ManageProjectUsers = () => {
  const { projectId, name: projectName } = useContext(ProjectConfigContext)
  const regionsQuery = useGetRegionsQuery({ variables: { project: projectId } })
  const usersQuery = useGetUsersInProjectQuery({ variables: { project: projectId } })

  if (regionsQuery.loading || usersQuery.loading) {
    return <Spinner />
  } else if (!regionsQuery.data || regionsQuery.error) {
    return <ErrorHandler refetch={regionsQuery.refetch} />
  } else if (!usersQuery.data || usersQuery.error) {
    return <ErrorHandler refetch={usersQuery.refetch} />
  }

  const regions = regionsQuery.data!!.regions
  const users = usersQuery.data!!.users

  return (
    <UsersTableContainer title={`Alle Benutzer von '${projectName} - Verwaltung'`}>
      <UsersTable users={users} regions={regions} refetch={usersQuery.refetch} />
    </UsersTableContainer>
  )
}

const ManageRegionUsers = ({ region }: { region: Region }) => {
  const { projectId } = useContext(ProjectConfigContext)
  const regionsQuery = useGetRegionsQuery({ variables: { project: projectId } })
  const usersQuery = useGetUsersInRegionQuery({ variables: { regionId: region!!.id } })

  if (regionsQuery.loading || usersQuery.loading) {
    return <Spinner />
  } else if (!regionsQuery.data || regionsQuery.error) {
    return <ErrorHandler refetch={regionsQuery.refetch} />
  } else if (!usersQuery.data || usersQuery.error) {
    return <ErrorHandler refetch={usersQuery.refetch} />
  }

  const regions = regionsQuery.data!!.regions
  const users = usersQuery.data!!.users

  return (
    <UsersTableContainer title={`Alle Verwalter der Region '${region.prefix} ${region.name}'`}>
      <UsersTable users={users} regions={regions} selectedRegionId={region.id} refetch={usersQuery.refetch} />
    </UsersTableContainer>
  )
}

const ManageUsersController = () => {
  const { role, region } = useContext(WhoAmIContext).me!
  if (role === Role.RegionAdmin && region) {
    return <ManageRegionUsers region={region} />
  } else if (role === Role.ProjectAdmin) {
    return <ManageProjectUsers />
  } else {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Benutzer zu verwalten.'
      />
    )
  }
}

export default ManageUsersController
