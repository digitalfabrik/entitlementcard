import React, { ReactElement, useContext, useEffect } from 'react'
import { Navigate } from 'react-router'

import { AuthContext } from './AuthProvider'

export const Logout = (): ReactElement => {
  const { signOut } = useContext(AuthContext)

  useEffect(() => {
    signOut()
  })

  return <Navigate to='/' replace />
}
