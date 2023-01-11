import { Button, Spinner } from '@blueprintjs/core'
import { createContext, ReactNode, useContext } from 'react'
import { useWhoAmIQuery, WhoAmIQuery } from './generated/graphql'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'
import StandaloneCenter from './components/StandaloneCenter'
import { AuthContext } from './AuthProvider'

export const WhoAmIContext = createContext<{
  me: WhoAmIQuery['me'] | null
  refetch: () => void
}>({
  me: null,
  refetch: () => {},
})

const WhoAmIProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useContext(ProjectConfigContext)
  const { signOut } = useContext(AuthContext)
  const { loading, error, data, refetch } = useWhoAmIQuery({
    variables: { project: projectId },
  })
  if (loading)
    return (
      <StandaloneCenter>
        <Spinner />
      </StandaloneCenter>
    )
  if (error || !data)
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
  return <WhoAmIContext.Provider value={{ me: data.me, refetch }}>{children}</WhoAmIContext.Provider>
}

export default WhoAmIProvider
