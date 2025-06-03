import { ApplicationStatus, GetApplicationsType, GetApplicationsVerificationType, VerificationStatus } from '../types'

export const getVerificationStatus = (verification: GetApplicationsVerificationType): VerificationStatus => {
  if (verification.verifiedDate) {
    return VerificationStatus.Verified
  }
  if (verification.rejectedDate) {
    return VerificationStatus.Rejected
  }
  return VerificationStatus.Awaiting
}

export const getApplicationStatus = (application: GetApplicationsType): ApplicationStatus => {
  if (application.withdrawalDate) {
    return ApplicationStatus.withdrawed
  }
  if (
    application.verifications.every(verification => getVerificationStatus(verification) === VerificationStatus.Verified)
  ) {
    return ApplicationStatus.fullyVerified
  }
  if (
    application.verifications.every(verification => getVerificationStatus(verification) === VerificationStatus.Rejected)
  ) {
    return ApplicationStatus.fullyRejected
  }
  return ApplicationStatus.ambiguous
}
