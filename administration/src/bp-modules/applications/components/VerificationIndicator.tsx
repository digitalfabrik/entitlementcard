/* eslint-disable react/destructuring-assignment */
import { Cancel, CheckCircle, Help } from '@mui/icons-material'
import { Box } from '@mui/material'
import React, { ReactElement } from 'react'

import { VerificationStatus } from '../types'

const colorByStatus = (status: VerificationStatus): 'success' | 'warning' | 'error' => {
  switch (status) {
    case VerificationStatus.Verified:
      return 'success'
    case VerificationStatus.Pending:
      return 'warning'
    case VerificationStatus.Rejected:
      return 'error'
  }
}

const Icon = (p: { status: VerificationStatus }): ReactElement => {
  const color = colorByStatus(p.status)

  switch (p.status) {
    case VerificationStatus.Verified:
      return <CheckCircle color={color} />
    case VerificationStatus.Pending:
      return <Help color={color} />
    case VerificationStatus.Rejected:
      return <Cancel color={color} />
  }
}

const VerificationIndicator = ({ status, text }: { status: VerificationStatus; text?: string }): ReactElement => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center' }} data-testid={`indicator-${status}`}>
    <Icon status={status} />
    {text}
  </Box>
)

export default VerificationIndicator
