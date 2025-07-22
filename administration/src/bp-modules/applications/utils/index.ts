import { GetApplicationsVerificationType, VerificationStatus } from '../types'

export const verificationStatus = (verification: GetApplicationsVerificationType): VerificationStatus => {
  if (verification.verifiedDate) {
    return VerificationStatus.Verified
  }
  if (verification.rejectedDate) {
    return VerificationStatus.Rejected
  }
  return VerificationStatus.Pending
}
