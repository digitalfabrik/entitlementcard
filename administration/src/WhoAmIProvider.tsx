import { Button, Spinner } from '@blueprintjs/core'
import React, { ReactElement, ReactNode, createContext, useContext, useMemo } from 'react'

import { AuthContext } from './AuthProvider'
import StandaloneCenter from './bp-modules/StandaloneCenter'
import { WhoAmIQuery, useWhoAmIQuery } from './generated/graphql'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'

export const WhoAmIContext = createContext<{
  me: WhoAmIQuery['me'] | null
  refetch: () => void
}>({
  me: null,
  refetch: () => undefined,
})

const WhoAmIProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { projectId } = useContext(ProjectConfigContext)
  const { signOut } = useContext(AuthContext)
  const { loading, error, data, refetch, previousData } = useWhoAmIQuery({
    variables: { project: projectId },
  })
  // Use the previous data (if existent) while potentially loading new data to prevent remounting
  const dataForContext = data ?? previousData
  const context = useMemo(() => ({ me: dataForContext?.me, refetch }), [dataForContext, refetch])

  if (!context.me && loading) {
    return (
      <StandaloneCenter>
        <Spinner />
      </StandaloneCenter>
    )
  }
  if (!context.me || error) {
    return (
      <StandaloneCenter>
        <p>Deine Konto-Informationen konnten nicht geladen werden.</p>
        <Button icon='repeat' onClick={refetch}>
          Erneut versuchen
        </Button>
        <Button icon='log-out' onClick={signOut}>
          Ausloggen
        </Button>
      </StandaloneCenter>
    )
  }
  // @ts-expect-error we checked above that context.me is not undefined
  return <WhoAmIContext.Provider value={context}>{children}</WhoAmIContext.Provider>
}

export default WhoAmIProvider
