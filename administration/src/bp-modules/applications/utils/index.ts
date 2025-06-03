import {
  ApplicationVerificationStatus,
  GetApplicationsType,
  GetApplicationsVerificationType,
  VerificationStatus,
} from '../types'

export const verificationStatus = (verification: GetApplicationsVerificationType): VerificationStatus => {
  if (verification.verifiedDate) {
    return VerificationStatus.Verified
  }
  if (verification.rejectedDate) {
    return VerificationStatus.Rejected
  }
  return VerificationStatus.Pending
}

export const applicationEffectiveStatus = (application: GetApplicationsType): ApplicationVerificationStatus => {
  if (application.withdrawalDate) {
    return ApplicationVerificationStatus.Withdrawn
  }
  if (
    application.verifications.every(verification => verificationStatus(verification) === VerificationStatus.Verified)
  ) {
    return ApplicationVerificationStatus.Approved
  }
  if (
    application.verifications.every(verification => verificationStatus(verification) === VerificationStatus.Rejected)
  ) {
    return ApplicationVerificationStatus.Rejected
  }
  return ApplicationVerificationStatus.Ambiguous
}
