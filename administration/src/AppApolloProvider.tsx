import React, { ReactElement, useContext } from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { AuthContext } from './AuthProvider'
import { createUploadLink } from 'apollo-upload-client'
import getApiBaseUrl from './util/getApiBaseUrl'

const httpLink = createUploadLink({ uri: getApiBaseUrl() })

const createAuthLink = (token?: string) =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }))

const createClient = (token?: string) =>
  new ApolloClient({
    link: createAuthLink(token).concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'network-only' },
    },
  })

const AppApolloProvider = ({ children }: { children: ReactElement }) => {
  const authContext = useContext(AuthContext)
  return <ApolloProvider client={createClient(authContext.data?.token)}>{children}</ApolloProvider>
}

export default AppApolloProvider
