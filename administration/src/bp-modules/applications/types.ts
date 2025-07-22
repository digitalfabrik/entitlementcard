import { GetApplicationsQuery } from '../../generated/graphql'

export type GetApplicationsType = GetApplicationsQuery['applications'][number]

export type GetApplicationsVerificationType = GetApplicationsType['verifications'][number]

export type ApplicationStatusBarItemType = {
  /** A translation key for this category */
  i18nKey: string
  /** A filter function that returns true if the given application should be included in this category. */
  filter: (application: GetApplicationsType) => boolean
}

export enum VerificationStatus {
  Verified,
  Rejected,
  Pending,
}
