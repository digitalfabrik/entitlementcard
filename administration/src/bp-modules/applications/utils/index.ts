import { VerificationStatus } from '../VerificationsView'
import { ApplicationStatus } from '../constants'

export const getApplicationStatus = (status: number[], isWithdrawed: boolean): ApplicationStatus => {
  if (isWithdrawed) return ApplicationStatus.withdrawed
  if (status.every(val => val === VerificationStatus.Verified)) return ApplicationStatus.fullyVerified
  if (status.every(val => val === VerificationStatus.Rejected)) return ApplicationStatus.fullyRejected
  return ApplicationStatus.ambiguous
}
