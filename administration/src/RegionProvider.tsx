import { Button, Spinner } from '@blueprintjs/core'
import { createContext, ReactNode, useContext } from 'react'
import { Region, useGetRegionsQuery } from './generated/graphql'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'
import { AuthContext } from './AuthProvider'

export const RegionContext = createContext<Region | null>(null)

const RegionProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useContext(ProjectConfigContext)
  const userRegionId = useContext(AuthContext).data?.administrator.regionId
  const { loading, error, data, refetch } = useGetRegionsQuery({
    variables: { project: projectId },
  })
  if (loading) return <Spinner />
  if (error || !data) return <Button icon='repeat' onClick={() => refetch()} />
  const region = data.regions.find(region => region.id === userRegionId)
  if (!region && typeof userRegionId === 'number') {
    return (
      <>
        <p>Your region was not found.</p>
        <Button icon='repeat' onClick={() => refetch()} />
      </>
    )
  }
  return <RegionContext.Provider value={region ?? null}>{children}</RegionContext.Provider>
}

export default RegionProvider
