import { Button, Spinner } from '@blueprintjs/core'
import React, { ReactElement, ReactNode, createContext, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthContext } from './AuthProvider'
import StandaloneCenter from './bp-modules/StandaloneCenter'
import { WhoAmIQuery, useWhoAmIQuery } from './generated/graphql'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'

type WhoAmIContextType = {
  me: WhoAmIQuery['me'] | null
  refetch: () => void
}

export const WhoAmIContext = createContext<WhoAmIContextType>({
  me: null,
  refetch: () => undefined,
})

type UseWhoAmIReturn = WhoAmIContextType & { me: WhoAmIQuery['me'] }

export const useWhoAmI = (): UseWhoAmIReturn => {
  const { me, ...context } = useContext(WhoAmIContext)
  if (!me) {
    throw new Error('WhoAmI context is not available')
  }
  return { me, ...context }
}

const WhoAmIProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { t } = useTranslation('auth')
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
        <p>{t('accountInformationNotAvailable')}</p>
        <Button icon='repeat' onClick={refetch}>
          {t('retry')}
        </Button>
        <Button icon='log-out' onClick={signOut}>
          {t('logout')}
        </Button>
      </StandaloneCenter>
    )
  }
  // @ts-expect-error we checked above that context.me is not undefined
  return <WhoAmIContext.Provider value={context}>{children}</WhoAmIContext.Provider>
}

export default WhoAmIProvider
