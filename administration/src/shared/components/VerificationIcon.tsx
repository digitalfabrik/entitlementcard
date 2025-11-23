/* eslint-disable react/destructuring-assignment */
import { Cancel, CheckCircle, Help } from '@mui/icons-material'
import { ReactElement } from 'react'

import { VerificationStatus } from '../verifications'

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

export const VerificationIcon = (p: { status: VerificationStatus }): ReactElement => {
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
