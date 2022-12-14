import React from 'react'
import Navigation from './components/Navigation'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import CreateCardsController from './components/create-cards/CreateCardsController'
import styled from 'styled-components'
import RegionProvider from './RegionProvider'
import AuthProvider, { AuthContext } from './AuthProvider'
import Login from './components/auth/Login'
import KeepAliveToken from './KeepAliveToken'
import ApplicationsController from './components/applications/ApplicationsController'
import { ProjectConfigProvider } from './project-configs/ProjectConfigContext'
import HomeController from './components/home/HomeController'
import RegionsController from './components/regions/RegionController'
import MetaTagsManager from './components/MetaTagsManager'
import { AppToasterProvider } from './components/AppToaster'
import UserSettingsController from './components/user-settings/UserSettingsController'
import ResetPasswordController from './components/auth/ResetPasswordController'
import ForgotPasswordController from './components/auth/ForgotPasswordController'
import ManageUsersController from './components/users/ManageUsersController'
import ApplyController from './application/components/ApplyController'
import { createUploadLink } from 'apollo-upload-client'
import { Role } from './generated/graphql'
import DataPrivacyPolicy from './components/DataPrivacyPolicy'

if (!process.env.REACT_APP_API_BASE_URL) {
  throw new Error('REACT_APP_API_BASE_URL is not set!')
}

const httpLink = createUploadLink({ uri: process.env.REACT_APP_API_BASE_URL })

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

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const isRegionAdmin = (role: Role): boolean => role === Role.RegionAdmin

const App = () => (
  <ProjectConfigProvider>
    <MetaTagsManager />
    <AppToasterProvider>
      <AuthProvider>
        <AuthContext.Consumer>
          {({ data: authData, signIn, signOut }) => (
            <ApolloProvider client={createClient(authData?.token)}>
              <BrowserRouter>
                <Routes>
                  <Route path={'/forgot-password'} element={<ForgotPasswordController />} />
                  <Route path={'/data-privacy-policy'} element={<DataPrivacyPolicy />} />
                  <Route path={'/apply-for-eak'} element={<ApplyController />} />
                  <Route path={'/reset-password/:passwordResetKey'} element={<ResetPasswordController />} />
                  <Route
                    path={'*'}
                    element={
                      authData === null || authData.expiry <= new Date() ? (
                        <Login onSignIn={signIn} />
                      ) : (
                        <KeepAliveToken authData={authData} onSignIn={signIn} onSignOut={signOut}>
                          <RegionProvider>
                            <Navigation onSignOut={signOut} />
                            <Main>
                              <Routes>
                                <Route
                                  path={'/applications'}
                                  element={<ApplicationsController token={authData.token} />}
                                />
                                <Route
                                  path={'/region'}
                                  element={
                                    isRegionAdmin(authData.administrator.role) ? (
                                      <RegionsController />
                                    ) : (
                                      <Navigate to={'/'} />
                                    )
                                  }
                                />
                                <Route path={'/create-cards'} element={<CreateCardsController />} />
                                <Route path={'/users'} element={<ManageUsersController />} />
                                <Route path={'/user-settings'} element={<UserSettingsController />} />
                                <Route path={'*'} element={<HomeController />} />
                              </Routes>
                            </Main>
                          </RegionProvider>
                        </KeepAliveToken>
                      )
                    }
                  />
                </Routes>
              </BrowserRouter>
            </ApolloProvider>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    </AppToasterProvider>
  </ProjectConfigProvider>
)

export default App
