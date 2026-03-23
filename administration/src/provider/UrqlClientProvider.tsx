import React, { ReactElement, useContext } from 'react'
import { Client, Provider, cacheExchange, fetchExchange } from 'urql'

import getApiBaseUrl from '../util/getApiBaseUrl'
import { AuthContext } from './AuthProvider'

const UrqlClientProvider = ({ children }: { children: ReactElement }): ReactElement => {
  const authContext = useContext(AuthContext)

  return (
    <Provider
      value={
        new Client({
          url: getApiBaseUrl(),
          fetchOptions: () => ({
            // TODO We probalby should use @urql/exchange-auth here:
            //  https://urql.dev/docs/advanced/authentication/
            headers: {
              authorization: `Bearer ${authContext.data?.token}`,
            },
          }),
          exchanges: [cacheExchange, fetchExchange],
          preferGetMethod: false,
        })
      }
    >
      {children}
    </Provider>
  )
}

export default UrqlClientProvider
