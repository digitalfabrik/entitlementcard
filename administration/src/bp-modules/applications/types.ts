import { GetApplicationsQuery } from '../../generated/graphql'

export type GetApplicationsType = GetApplicationsQuery['applications'][number]

export type GetApplicationsVerificationType = GetApplicationsType['verifications'][number]

export type ApplicationStatusBarItemType = {
  title: string
  status?: ApplicationStatus
}

export enum ApplicationStatus {
  fullyVerified,
  fullyRejected,
  withdrawed,
  ambiguous,
}

export enum VerificationStatus {
  Verified,
  Rejected,
  Awaiting,
}
