import { type ApplicationVerification, VerificationStatus } from '../types'

export const verificationStatus = (verification: ApplicationVerification): VerificationStatus => {
  if (verification.verifiedDate) {
    return VerificationStatus.Verified
  }
  if (verification.rejectedDate) {
    return VerificationStatus.Rejected
  }
  return VerificationStatus.Pending
}
