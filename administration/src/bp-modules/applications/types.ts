import { GetApplicationsQuery } from '../../generated/graphql'

export type GetApplicationsType = GetApplicationsQuery['applications'][number]

export type GetApplicationsVerificationType = GetApplicationsType['verifications'][number]

export type ApplicationStatusBarItemType = {
  title: string
  status?: ApplicationVerificationStatus
}

/**
 * The application status, taking into account its verifications, and `application.withdrawalDate`.
 */
export enum ApplicationVerificationStatus {
  Approved,
  Rejected,
  Ambiguous,
  Withdrawn,
}

export enum VerificationStatus {
  Verified,
  Rejected,
  Pending,
}
