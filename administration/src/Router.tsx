import React, { Suspense, useContext, useMemo } from 'react'
import { Outlet, RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import { AuthContext } from './AuthProvider'
import KeepAliveToken from './KeepAliveToken'
import WhoAmIProvider from './WhoAmIProvider'
import Navigation from './bp-modules/NavigationBar'
import LoadingSpinner from './mui-modules/components/LoadingSpinner'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'
import lazyWithRetry from './util/retryImport'

const ActivationPage = lazyWithRetry(() => import('./mui-modules/activation/ActivationPage'))
const ApplicationsController = lazyWithRetry(() => import('./bp-modules/applications/ApplicationsController'))
const DataPrivacyController = lazyWithRetry(
  () => import('./bp-modules/regions/data-privacy-policy/DataPrivacyController')
)
const ForgotPasswordController = lazyWithRetry(() => import('./bp-modules/auth/ForgotPasswordController'))
const ResetPasswordController = lazyWithRetry(() => import('./bp-modules/auth/ResetPasswordController'))
const ApplyController = lazyWithRetry(() => import('./mui-modules/application/ApplyController'))
const ApplicationVerificationController = lazyWithRetry(
  () => import('./mui-modules/application-verification/ApplicationVerificationController')
)
const ApplicationApplicantController = lazyWithRetry(
  () => import('./mui-modules/application-verification/ApplicationApplicantController')
)
const StatisticsController = lazyWithRetry(() => import('./bp-modules/statistics/StatisticsController'))
const AddCardsController = lazyWithRetry(() => import('./bp-modules/cards/AddCardsController'))
const CreateCardsController = lazyWithRetry(() => import('./bp-modules/cards/CreateCardsController'))
const ImportCardsController = lazyWithRetry(() => import('./bp-modules/cards/ImportCardsController'))
const HomeController = lazyWithRetry(() => import('./bp-modules/home/HomeController'))
const RegionsController = lazyWithRetry(() => import('./bp-modules/regions/RegionController'))
const DataPrivacyPolicy = lazyWithRetry(() => import('./bp-modules/regions/data-privacy-policy/DataPrivacyPolicy'))
const StoresController = lazyWithRetry(() => import('./bp-modules/stores/StoresController'))
const UserSettingsController = lazyWithRetry(() => import('./bp-modules/user-settings/UserSettingsController'))
const ManageUsersController = lazyWithRetry(() => import('./bp-modules/users/ManageUsersController'))
const Login = lazyWithRetry(() => import('./bp-modules/auth/Login'))

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media print {
    justify-content: start;
  }
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
          ...(projectConfig.cardStatistics ? [{ path: 'statistics', element: <StatisticsController /> }] : []),
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
          { path: '*', element: <HomeController /> },
        ],
      },
    ]
    return createBrowserRouter(routes.filter((element): element is RouteObject => element !== null))
  }, [authData, projectConfig.applicationFeature, signIn, signOut, projectConfig.cardStatistics])

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default Router
