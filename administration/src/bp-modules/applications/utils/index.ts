import { type ApplicationVerification, VerificationStatus } from '../types'

export const verificationStatus = (
  verification: Pick<ApplicationVerification, 'rejectedDate' | 'verifiedDate'>
): VerificationStatus => {
  if (verification.verifiedDate) {
    return VerificationStatus.Verified
  }
  if (verification.rejectedDate) {
    return VerificationStatus.Rejected
  }
  return VerificationStatus.Pending
}
