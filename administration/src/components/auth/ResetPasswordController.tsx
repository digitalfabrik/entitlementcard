import { useParams } from 'react-router-dom'
import React from 'react'

const ResetPasswordController = () => {
  const { resetPasswordHash } = useParams()

  return <div>{resetPasswordHash}</div>
}

export default ResetPasswordController
