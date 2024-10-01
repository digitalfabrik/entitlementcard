import { Button, Spinner } from '@blueprintjs/core'
import { ReactElement, ReactNode, createContext, useContext } from 'react'

import { AuthContext } from './AuthProvider'
import StandaloneCenter from './bp-modules/StandaloneCenter'
import { WhoAmIQuery, useWhoAmIQuery } from './generated/graphql'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'

export const WhoAmIContext = createContext<{
  me: WhoAmIQuery['me'] | null
  refetch: () => void
}>({
  me: null,
  refetch: () => {},
})

const WhoAmIProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { projectId } = useContext(ProjectConfigContext)
  const { signOut } = useContext(AuthContext)
  const { loading, error, data, refetch, previousData } = useWhoAmIQuery({
    variables: { project: projectId },
  })
  // Use the previous data (if existent) while potentially loading new data to prevent remounting
  const dataForContext = data ?? previousData
  if (!dataForContext && loading) {
    return (
      <StandaloneCenter>
        <Spinner />
      </StandaloneCenter>
    )
  }
  if (!dataForContext || error) {
    return (
      <StandaloneCenter>
        <p>Deine Konto-Informationen konnten nicht geladen werden.</p>
        <Button icon='repeat' onClick={() => refetch()}>
          Erneut versuchen
        </Button>
        <Button icon='log-out' onClick={() => signOut()}>
          Ausloggen
        </Button>
      </StandaloneCenter>
    )
  }
  return <WhoAmIContext.Provider value={{ me: dataForContext.me, refetch }}>{children}</WhoAmIContext.Provider>
}

export default WhoAmIProvider
