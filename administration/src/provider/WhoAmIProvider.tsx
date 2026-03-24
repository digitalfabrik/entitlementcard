import { Logout, Replay } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'
import React, { ReactElement, ReactNode, createContext, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import CenteredCircularProgress from '../components/CenteredCircularProgress'
import StandaloneCenter from '../components/StandaloneCenter'
import { WhoAmIDocument, WhoAmIQuery } from '../graphql'
import { hasProp } from '../util/helper'
import { AuthContext } from './AuthProvider'

export type WhoAmIContextType = {
  me: WhoAmIQuery['me'] | null
  refetch: () => void
}

export const WhoAmIContext = createContext<WhoAmIContextType>({
  me: null,
  refetch: () => undefined,
})

export const useWhoAmI = (): WhoAmIContextType & { me: WhoAmIQuery['me'] } => {
  const context = useContext(WhoAmIContext)
  if (!hasProp(context, 'me')) {
    throw new Error('WhoAmI context is not available')
  }
  return context
}

const WhoAmIProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { t } = useTranslation('auth')
  const { signOut } = useContext(AuthContext)
  const [whoAmIState, whoAmIQuery] = useQuery({ query: WhoAmIDocument })
  const { fetching, error, data } = whoAmIState
  // urql preserves previous data in `data` while stale/fetching, so no need for previousData
  const refetch = () => whoAmIQuery({ requestPolicy: 'network-only' })
  const context = useMemo(() => ({ me: data?.me, refetch }), [data, refetch])

  if (!hasProp(context, 'me') && fetching) {
    return <CenteredCircularProgress />
  }
  if (!hasProp(context, 'me') || error) {
    return (
      <StandaloneCenter>
        <Typography variant='body1' component='p'>
          {t('accountInformationNotAvailable')}
        </Typography>
        <Stack direction='row' spacing={2}>
          <Button variant='outlined' startIcon={<Replay />} onClick={() => refetch()}>
            {t('retry')}
          </Button>
          <Button variant='contained' color='error' startIcon={<Logout />} onClick={signOut}>
            {t('logout')}
          </Button>
        </Stack>
      </StandaloneCenter>
    )
  }

  return <WhoAmIContext.Provider value={context}>{children}</WhoAmIContext.Provider>
}

export default WhoAmIProvider
