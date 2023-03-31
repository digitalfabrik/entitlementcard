import React, { useContext, useMemo } from 'react'
import Navigation from './components/Navigation'
import { createBrowserRouter, Outlet, RouteObject, RouterProvider } from 'react-router-dom'
import CreateCardsController from './components/cards/CreateCardsController'
import styled from 'styled-components'
import WhoAmIProvider from './WhoAmIProvider'
import { AuthContext } from './AuthProvider'
import Login from './components/auth/Login'
import KeepAliveToken from './KeepAliveToken'
import ApplicationsController from './components/applications/ApplicationsController'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'
import HomeController from './components/home/HomeController'
import RegionsController from './components/regions/RegionController'
import UserSettingsController from './components/user-settings/UserSettingsController'
import ResetPasswordController from './components/auth/ResetPasswordController'
import ForgotPasswordController from './components/auth/ForgotPasswordController'
import ManageUsersController from './components/users/ManageUsersController'
import ApplyController from './mui-components/application/ApplyController'
import DataPrivacyPolicy from './components/DataPrivacyPolicy'
import ApplicationVerificationController from './mui-components/application-verification/ApplicationVerificationController'
import ApplicationApplicantController from './mui-components/application-verification/ApplicationApplicantController'

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Router = () => {
  const { data: authData, signIn, signOut } = useContext(AuthContext)
  const projectConfig = useContext(ProjectConfigContext)
  const router = useMemo(() => {
    const isLoggedIn = authData !== null && authData.expiry > new Date()
    const routes: (RouteObject | null)[] = [
      { path: '/forgot-password', element: <ForgotPasswordController /> },
      { path: '/reset-password/', element: <ResetPasswordController /> },
      { path: '/data-privacy-policy', element: <DataPrivacyPolicy /> },
      ...(projectConfig.applicationFeatureEnabled
        ? [
            { path: '/beantragen', element: <ApplyController /> },
            {
              path: '/antrag-verifizieren/:applicationVerificationAccessKey',
              element: <ApplicationVerificationController />,
            },
            { path: '/antrag-einsehen/:accessKey', element: <ApplicationApplicantController /> },
          ]
        : []),
      {
        path: '*',
        element: !isLoggedIn ? (
          <Login onSignIn={signIn} />
        ) : (
          <WhoAmIProvider>
            <KeepAliveToken authData={authData} onSignIn={signIn} onSignOut={signOut}>
              <Navigation onSignOut={signOut} />
              <Main>
                <Outlet />
              </Main>
            </KeepAliveToken>
          </WhoAmIProvider>
        ),
        children: [
          ...(projectConfig.applicationFeatureEnabled
            ? [
                { path: 'applications', element: <ApplicationsController /> },
                // Currently, '/region' only allows to set the data privacy text for the application form
                { path: 'region', element: <RegionsController /> },
              ]
            : []),
          { path: 'create-cards', element: <CreateCardsController /> },
          { path: 'users', element: <ManageUsersController /> },
          { path: 'user-settings', element: <UserSettingsController /> },
          { path: '*', element: <HomeController /> },
        ],
      },
    ]
    return createBrowserRouter(routes.filter((element): element is RouteObject => element !== null))
  }, [authData, projectConfig.applicationFeatureEnabled, signIn, signOut])

  return <RouterProvider router={router} />
}

export default Router
