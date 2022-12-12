import { Button, Spinner } from '@blueprintjs/core'
import { createContext, ReactNode, useContext } from 'react'
import { Region, useGetRegionsQuery } from './generated/graphql'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'
import { AuthContext } from './AuthProvider'
import StandaloneCenter from './components/StandaloneCenter'

export const RegionContext = createContext<Region | null>(null)

const RegionProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useContext(ProjectConfigContext)
  const userRegionId = useContext(AuthContext).data?.administrator.regionId
  const { loading, error, data, refetch } = useGetRegionsQuery({
    variables: { project: projectId },
  })
  if (loading)
    return (
      <StandaloneCenter>
        <Spinner />
      </StandaloneCenter>
    )
  if (error || !data) return <Button icon='repeat' onClick={() => refetch()} />
  const region = data.regions.find(region => region.id === userRegionId)
  if (!region && typeof userRegionId === 'number') {
    return (
      <StandaloneCenter>
        <p>Your region was not found.</p>
        <Button icon='repeat' onClick={() => refetch()} />
      </StandaloneCenter>
    )
  }
  return <RegionContext.Provider value={region ?? null}>{children}</RegionContext.Provider>
}

export default RegionProvider
