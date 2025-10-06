import { Logout, Replay } from '@mui/icons-material'
import { Button, Stack, Typography } from '@mui/material'
import React, { ReactElement, ReactNode, createContext, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthContext } from './AuthProvider'
import StandaloneCenter from './bp-modules/StandaloneCenter'
import { WhoAmIQuery, useWhoAmIQuery } from './generated/graphql'
import CenteredCircularProgress from './mui-modules/base/CenteredCircularProgress'
import { hasProp } from './util/helper'

type WhoAmIContextType = {
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
  const { loading, error, data, refetch, previousData } = useWhoAmIQuery()
  // Use the previous data (if existent) while potentially loading new data to prevent remounting
  const dataForContext = data ?? previousData
  const context = useMemo(() => ({ me: dataForContext?.me, refetch }), [dataForContext, refetch])

  if (!hasProp(context, 'me') && loading) {
    return <CenteredCircularProgress />
  }
  if (!hasProp(context, 'me') || error) {
    return (
      <StandaloneCenter>
        <Typography component='p'>{t('accountInformationNotAvailable')}</Typography>
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
