import React, { useContext, useMemo } from 'react'
import { Outlet, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import { AuthContext } from './AuthProvider'
import KeepAliveToken from './KeepAliveToken'
import WhoAmIProvider from './WhoAmIProvider'
import Navigation from './bp-modules/NavigationBar'
import ApplicationsController from './bp-modules/applications/ApplicationsController'
import ForgotPasswordController from './bp-modules/auth/ForgotPasswordController'
import Login from './bp-modules/auth/Login'
import ResetPasswordController from './bp-modules/auth/ResetPasswordController'
import CreateCardsController from './bp-modules/cards/CreateCardsController'
import HomeController from './bp-modules/home/HomeController'
import DataPrivacyPolicy from './bp-modules/regions/DataPrivacyPolicy'
import RegionsController from './bp-modules/regions/RegionController'
import UserSettingsController from './bp-modules/user-settings/UserSettingsController'
import ManageUsersController from './bp-modules/users/ManageUsersController'
import ApplicationApplicantController from './mui-modules/application-verification/ApplicationApplicantController'
import ApplicationVerificationController from './mui-modules/application-verification/ApplicationVerificationController'
import ApplyController from './mui-modules/application/ApplyController'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'

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
