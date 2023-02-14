import React, { useContext } from 'react'
import Navigation from './components/Navigation'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
import ApplyController from './application/components/ApplyController'
import DataPrivacyPolicy from './components/DataPrivacyPolicy'

const Main = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Router = () => {
  const { data: authData, signIn, signOut } = useContext(AuthContext)
  const projectConfig = useContext(ProjectConfigContext)
  return (
    <BrowserRouter>
      <Routes>
        <Route path={'/forgot-password'} element={<ForgotPasswordController />} />
        <Route path={'/data-privacy-policy'} element={<DataPrivacyPolicy />} />
        {projectConfig.applicationFeatureEnabled ? <Route path={'/beantragen'} element={<ApplyController />} /> : null}
        <Route path={'/reset-password/:passwordResetKey'} element={<ResetPasswordController />} />
        <Route
          path={'*'}
          element={
            authData === null || authData.expiry <= new Date() ? (
              <Login onSignIn={signIn} />
            ) : (
              <WhoAmIProvider>
                <KeepAliveToken authData={authData} onSignIn={signIn} onSignOut={signOut}>
                  <Navigation onSignOut={signOut} />
                  <Main>
                    <Routes>
                      {projectConfig.applicationFeatureEnabled ? (
                        <>
                          <Route path={'/applications'} element={<ApplicationsController />} />
                          {/*Currently, '/region' only allows to set the data privacy text for the application form*/}
                          <Route path={'/region'} element={<RegionsController />} />
                        </>
                      ) : null}
                      <Route path={'/create-cards'} element={<CreateCardsController />} />
                      <Route path={'/users'} element={<ManageUsersController />} />
                      <Route path={'/user-settings'} element={<UserSettingsController />} />
                      <Route path={'*'} element={<HomeController />} />
                    </Routes>
                  </Main>
                </KeepAliveToken>
              </WhoAmIProvider>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
