import React, { ReactElement, useContext, useMemo } from 'react'
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
} from 'react-router'

import AutomaticLogoutDialog from './auth/AutomaticLogoutDialog'
import Login from './auth/Login'
import { JsonField } from './components/JsonFieldView'
import NavigationBar from './components/NavigationBar'
import useMetaTags from './hooks/useMetaTags'
import type { ProjectConfig } from './project-configs'
import { ProjectConfigContext } from './project-configs/ProjectConfigContext'
import { AuthContext } from './provider/AuthProvider'
import WhoAmIProvider from './provider/WhoAmIProvider'
import ActivationPage from './routes/activation/ActivationPage'
import ActivityLogController from './routes/activity-log/ActivityLogController'
import ApplicationApplicantController from './routes/antrag-einsehen/ApplicationApplicantController'
import ApplicationVerificationController from './routes/antrag-verifizieren/ApplicationVerificationController'
import ApplicationsController from './routes/applications/ApplicationsController'
import ApplyController from './routes/beantragen/ApplyController'
import CreateCardsController from './routes/cards/CreateCardsController'
import AddCardsController from './routes/cards/add/AddCardsController'
import ImportCardsController from './routes/cards/import/ImportCardsController'
import DataPrivacyPolicy from './routes/data-privacy-policy/DataPrivacyPolicy'
import DownloadPage from './routes/download/DownloadPage'
import CardSelfServiceView from './routes/erstellen/CardSelfServiceView'
import ForgotPasswordController from './routes/forgot-password/ForgotPasswordController'
import HomeController from './routes/home/HomeController'
import ImprintPage from './routes/imprint/ImprintPage'
import { Logout } from './routes/logout/Logout'
import ProjectSettingsController from './routes/project/ProjectSettingsController'
import RegionController from './routes/region/RegionController'
import DataPrivacyController from './routes/region/data-privacy-policy/DataPrivacyController'
import ResetPasswordController from './routes/reset-password/ResetPasswordController'
import StatisticsController from './routes/statistics/StatisticsController'
import StoresController from './routes/stores/StoresController'
import StoresImportController from './routes/stores/import/StoresImportController'
import UserSettingsController from './routes/user-settings/UserSettingsController'
import ManageUsersController from './routes/users/ManageUsersController'

/** Creates a route string in a type-safe way. */
export const createRoute = (
  route:
    | { page: 'cards' }
    /** Throws, if the application data cannot be mapped to a query. */
    | {
        page: 'cards/addquery'
        application: { id: number; jsonValue: JsonField<'Array'> }
        projectConfig: ProjectConfig
      },
): string => {
  switch (route.page) {
    case 'cards':
      return '/cards'
    case 'cards/addquery': {
      const query = route.projectConfig.applicationFeature?.applicationJsonToCardQuery(
        route.application.jsonValue,
      )

      if (typeof query === 'string') {
        return `/cards/add${query}&applicationIdToMarkAsProcessed=${route.application.id}`
      }
      throw new Error('Application data cannot be mapped to a query')
    }
    default:
      throw new Error('Unknown route')
  }
}

const AuthLayout = (): ReactElement => {
  const { data: authData, signIn } = useContext(AuthContext)
  const navigate = useNavigate()
  const isLoggedIn = authData !== null && authData.expiry > new Date()

  return isLoggedIn ? (
    <WhoAmIProvider>
      <AutomaticLogoutDialog
        expiresAt={authData.expiry}
        onSignIn={signIn}
        onSignOut={() => {
          navigate('/logout', { replace: true })
        }}
      />
      <NavigationBar />
      <Outlet />
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
            <Route path='/logout' Component={Logout} />

            {projectConfig.applicationFeature && (
              <>
                <Route
                  path='/antrag-verifizieren/:applicationVerificationAccessKey'
                  element={<ApplicationVerificationController />}
                />
                <Route
                  path='/antrag-einsehen/:accessKey'
                  element={<ApplicationApplicantController />}
                />
                <Route path='/beantragen' element={<ApplyController />} />
              </>
            )}

            {projectConfig.selfServiceEnabled && (
              <Route path='/erstellen' element={<CardSelfServiceView />} />
            )}

            {/* Authenticated routes */}

            <Route path='*' element={<AuthLayout />}>
              <Route path='project' element={<ProjectSettingsController />} />
              <Route path='stores' element={<StoresController />} />
              <Route path='stores/import' element={<StoresImportController />} />
              <Route path='user-settings' element={<UserSettingsController />} />
              <Route path='users' element={<ManageUsersController />} />
              <Route path='*' element={<HomeController />} />

              {projectConfig.cardStatistics.enabled && (
                <Route path='statistics' element={<StatisticsController />} />
              )}

              {projectConfig.applicationFeature && (
                <>
                  <Route path='applications' element={<ApplicationsController />} />
                  {/* Currently, '/region' only allows setting the data privacy text for the application form */}
                  <Route path='region' element={<RegionController />} />
                  <Route path='region/data-privacy-policy' element={<DataPrivacyController />} />
                </>
              )}

              {projectConfig.activityLogConfig && (
                <Route
                  path='activity-log'
                  element={
                    <ActivityLogController activityLogConfig={projectConfig.activityLogConfig} />
                  }
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
          </>,
        ),
      ),
    [projectConfig],
  )

  return <RouterProvider router={router} />
}

export default Router
