import React, { ReactElement, useContext, useMemo } from 'react'
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
import AddCardsController from './bp-modules/cards/AddCardsController'
import CreateCardsController from './bp-modules/cards/CreateCardsController'
import ImportCardsController from './bp-modules/cards/ImportCardsController'
import HomeController from './bp-modules/home/HomeController'
import ProjectSettingsController from './bp-modules/project-settings/ProjectSettingsController'
import RegionsController from './bp-modules/regions/RegionController'
import DataPrivacyController from './bp-modules/regions/data-privacy-policy/DataPrivacyController'
import DataPrivacyPolicy from './bp-modules/regions/data-privacy-policy/DataPrivacyPolicy'
import CardSelfServiceView from './bp-modules/self-service/CardSelfServiceView'
import StatisticsController from './bp-modules/statistics/StatisticsController'
import StoresController from './bp-modules/stores/StoresController'
import StoresImportController from './bp-modules/stores/StoresImportController'
import UserSettingsController from './bp-modules/user-settings/UserSettingsController'
import ManageUsersController from './bp-modules/users/ManageUsersController'
import ActivationPage from './mui-modules/activation/ActivationPage'
import ApplicationApplicantController from './mui-modules/application-verification/ApplicationApplicantController'
import ApplicationVerificationController from './mui-modules/application-verification/ApplicationVerificationController'
import ApplyController from './mui-modules/application/ApplyController'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media print {
    justify-content: start;
  }
`

export const FREINET_PARAM = 'freinet'

const Router = (): ReactElement => {
  const { data: authData, signIn, signOut } = useContext(AuthContext)
  const projectConfig = useContext(ProjectConfigContext)
  const router = useMemo(() => {
    const isLoggedIn = authData !== null && authData.expiry > new Date()
    const routes: (RouteObject | null)[] = [
      { path: '/forgot-password', element: <ForgotPasswordController /> },
      { path: '/reset-password/', element: <ResetPasswordController /> },
      { path: '/data-privacy-policy', element: <DataPrivacyPolicy /> },
      { path: '/activation/:activationCode', element: <ActivationPage /> },
      ...(projectConfig.applicationFeature
        ? [
            { path: '/beantragen', element: <ApplyController /> },
            {
              path: '/antrag-verifizieren/:applicationVerificationAccessKey',
              element: <ApplicationVerificationController />,
            },
            { path: '/antrag-einsehen/:accessKey', element: <ApplicationApplicantController /> },
          ]
        : []),
      ...(projectConfig.selfServiceEnabled ? [{ path: '/erstellen', element: <CardSelfServiceView /> }] : []),
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
          ...(projectConfig.applicationFeature
            ? [
                { path: 'applications', element: <ApplicationsController /> },
                { path: 'region/data-privacy-policy', element: <DataPrivacyController /> },
                // Currently, '/region' only allows to set the data privacy text for the application form
                { path: 'region', element: <RegionsController /> },
              ]
            : []),
          ...(projectConfig.cardStatistics.enabled ? [{ path: 'statistics', element: <StatisticsController /> }] : []),
          ...(projectConfig.cardCreation
            ? [
                { path: 'cards', element: <CreateCardsController /> },
                { path: 'cards/add', element: <AddCardsController /> },
                { path: 'cards/import', element: <ImportCardsController /> },
              ]
            : []),
          { path: 'users', element: <ManageUsersController /> },
          { path: 'user-settings', element: <UserSettingsController /> },
          { path: 'stores', element: <StoresController /> },
          { path: 'stores/import', element: <StoresImportController /> },
          { path: 'project', element: <ProjectSettingsController /> },
          { path: '*', element: <HomeController /> },
        ],
      },
    ]
    return createBrowserRouter(routes.filter((element): element is RouteObject => element !== null))
  }, [authData, signIn, signOut, projectConfig])

  return <RouterProvider router={router} />
}

export default Router
