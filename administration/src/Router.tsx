import React, { ReactElement, useContext, useMemo } from 'react'
import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router'

import { AuthContext } from './AuthProvider'
import KeepAliveToken from './KeepAliveToken'
import WhoAmIProvider from './WhoAmIProvider'
import Navigation from './bp-modules/NavigationBar'
import ActivityLogController from './bp-modules/activity-log/ActivityLogController'
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
import useMetaTags from './hooks/useMetaTags'
import ActivationPage from './mui-modules/activation/ActivationPage'
import ApplicationApplicantController from './mui-modules/application-verification/ApplicationApplicantController'
import ApplicationVerificationController from './mui-modules/application-verification/ApplicationVerificationController'
import ApplyController from './mui-modules/application/ApplyController'
import ImprintPage from './mui-modules/imprint/ImprintPage'
import DownloadPage from './mui-modules/download/DownloadPage'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'

const AuthLayout = (): ReactElement => {
  const { data: authData, signIn, signOut } = useContext(AuthContext)
  const isLoggedIn = authData !== null && authData.expiry > new Date()

  return isLoggedIn ? (
    <WhoAmIProvider>
      <KeepAliveToken authData={authData} onSignIn={signIn} onSignOut={signOut}>
        <Navigation onSignOut={signOut} />
        <Outlet />
      </KeepAliveToken>
    </WhoAmIProvider>
  ) : (
    <Login onSignIn={signIn} />
  )
}

const Router = (): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  useMetaTags()

  const router = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            {/* Public routes */}

            <Route path='/activation/:activationCode' element={<ActivationPage />} />
            <Route path='/data-privacy-policy' element={<DataPrivacyPolicy />} />
            <Route path='/forgot-password' element={<ForgotPasswordController />} />
            <Route path='/reset-password/' element={<ResetPasswordController />} />
            <Route path='/imprint/' element={<ImprintPage />} />
            <Route path='/download/' element={<DownloadPage />} />

            {projectConfig.applicationFeature && (
              <>
                <Route
                  path='/antrag-verifizieren/:applicationVerificationAccessKey'
                  element={<ApplicationVerificationController />}
                />
                <Route path='/antrag-einsehen/:accessKey' element={<ApplicationApplicantController />} />
                <Route path='/beantragen' element={<ApplyController />} />
              </>
            )}

            {projectConfig.selfServiceEnabled && <Route path='/erstellen' element={<CardSelfServiceView />} />}

            {/* Authenticated routes */}

            <Route path='*' element={<AuthLayout />}>
              <Route path='project' element={<ProjectSettingsController />} />
              <Route path='stores' element={<StoresController />} />
              <Route path='stores/import' element={<StoresImportController />} />
              <Route path='user-settings' element={<UserSettingsController />} />
              <Route path='users' element={<ManageUsersController />} />
              <Route path='*' element={<HomeController />} />

              {projectConfig.cardStatistics.enabled && <Route path='statistics' element={<StatisticsController />} />}

              {projectConfig.applicationFeature && (
                <>
                  <Route path='applications' element={<ApplicationsController />} />
                  {/* Currently, '/region' only allows setting the data privacy text for the application form */}
                  <Route path='region' element={<RegionsController />} />
                  <Route path='region/data-privacy-policy' element={<DataPrivacyController />} />
                </>
              )}

              {projectConfig.activityLogConfig && (
                <Route
                  path='activity-log'
                  element={<ActivityLogController activityLogConfig={projectConfig.activityLogConfig} />}
                />
              )}

              {projectConfig.cardCreation && (
                <>
                  <Route path='cards' element={<CreateCardsController />} />
                  <Route path='cards/add' element={<AddCardsController />} />
                  <Route path='cards/import' element={<ImportCardsController />} />
                </>
              )}
            </Route>
          </>
        )
      ),
    [projectConfig]
  )

  return <RouterProvider router={router} />
}

export default Router
