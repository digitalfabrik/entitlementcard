import { ApplicationStatus, GetApplicationsVerificationType, VerificationStatus } from '../types'

export const getApplicationStatus = (status: number[], isWithdrawed: boolean): ApplicationStatus => {
  if (isWithdrawed) {
    return ApplicationStatus.withdrawed
  }
  if (status.every(val => val === VerificationStatus.Verified)) {
    return ApplicationStatus.fullyVerified
  }
  if (status.every(val => val === VerificationStatus.Rejected)) {
    return ApplicationStatus.fullyRejected
  }
  return ApplicationStatus.ambiguous
}

export const getVerificationStatus = (verification: GetApplicationsVerificationType): VerificationStatus => {
  if (verification.verifiedDate) {
    return VerificationStatus.Verified
  }
  if (verification.rejectedDate) {
    return VerificationStatus.Rejected
  }
  return VerificationStatus.Awaiting
}
