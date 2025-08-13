import { ApplicationVerificationView } from '../generated/graphql'

export const isEmailValid = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export enum VerificationStatus {
  Verified,
  Rejected,
  Pending,
}

export const verificationStatus = (
  verification: Pick<ApplicationVerificationView, 'rejectedDate' | 'verifiedDate'>
): VerificationStatus => {
  if (verification.verifiedDate) {
    return VerificationStatus.Verified
  }
  if (verification.rejectedDate) {
    return VerificationStatus.Rejected
  }
  return VerificationStatus.Pending
}
