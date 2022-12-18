import { Button, Card, H3, Spinner } from '@blueprintjs/core'
import { ReactElement, useContext } from 'react'
import { AuthContext } from '../../AuthProvider'
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
import { RegionContext } from '../../RegionProvider'

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

const UsersTableContainer = ({ children, title }: { children: ReactElement; title: string }) => {
  return (
    <StandaloneCenter>
      <Card style={{ maxWidth: '800px', margin: '16px' }}>
        <H3>{title}</H3>
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
    return <RefetchCard refetch={regionsQuery.refetch} />
  } else if (!usersQuery.data || usersQuery.error) {
    return <RefetchCard refetch={usersQuery.refetch} />
  }

  const regions = regionsQuery.data!!.regions
  const users = usersQuery.data!!.users

  return (
    <UsersTableContainer title={`Alle Benutzer von '${projectName} - Verwaltung'`}>
      <UsersTable users={users} regions={regions} showRegion={true} refetch={usersQuery.refetch} />
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
    return <RefetchCard refetch={regionsQuery.refetch} />
  } else if (!usersQuery.data || usersQuery.error) {
    return <RefetchCard refetch={usersQuery.refetch} />
  }

  const regions = regionsQuery.data!!.regions
  const users = usersQuery.data!!.users

  return (
    <UsersTableContainer title={`Alle Verwalter der Region '${region.name}'`}>
      <UsersTable users={users} regions={regions} showRegion={false} refetch={usersQuery.refetch} />
    </UsersTableContainer>
  )
}

const ManageUsersController = () => {
  const role = useContext(AuthContext).data!.administrator.role
  const region = useContext(RegionContext)
  if (role === Role.RegionAdmin && region !== null) {
    return <ManageRegionUsers region={region} />
  } else if (role === Role.ProjectAdmin) {
    return <ManageProjectUsers />
  } else {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p>Sie sind nicht berechtigt, Benutzer zu verwalten.</p>
      </div>
    )
  }
}

export default ManageUsersController
