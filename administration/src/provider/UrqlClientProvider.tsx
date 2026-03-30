import React, { ReactElement, useContext, useMemo } from 'react'
import { Client, Provider, cacheExchange, fetchExchange } from 'urql'

import getApiBaseUrl from '../util/getApiBaseUrl'
import { AuthContext } from './AuthProvider'

const UrqlClientProvider = ({ children }: { children: ReactElement }): ReactElement => {
  const authContext = useContext(AuthContext)

  const client = useMemo(
    () =>
      new Client({
        url: getApiBaseUrl(),
        fetchOptions: () => ({
          // TODO We probably should use @urql/exchange-auth here:
          //  https://urql.dev/docs/advanced/authentication/
          headers: {
            authorization: `Bearer ${authContext.data?.token}`,
          },
        }),
        exchanges: [cacheExchange, fetchExchange],
        preferGetMethod: false,
      }),
    [authContext],
  )

  return <Provider value={client}>{children}</Provider>
}

export default UrqlClientProvider
