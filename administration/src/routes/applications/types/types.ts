import {
  ApplicationVerificationView,
  GetApplicationsQuery,
  SearchAcceptingStoresInProjectQuery,
} from '../../../generated/graphql'
import { ApplicationParsedJsonValue } from '../utils/application'

/** A Verification that was obtained from the `getApplications` query. */
export type ApplicationVerification =
  GetApplicationsQuery['applications'][number]['verifications'][number]

export type ApplicationStatusBarItemType = {
  /** A translation key for this category's bar item */
  barItemI18nKey: string
  /** A translation key for an adjective specific for the item this filter allows. */
  applicationAdjectiveI18nKey: string
  /** A filter function that returns true if the given application should be included in this category. */
  filter: (application: Application) => boolean
}

/** An application that was obtained from the `getApplications` query. */
export type Application = ApplicationParsedJsonValue<GetApplicationsQuery['applications'][number]>

export type ApplicationVerificationPublic = Omit<
  ApplicationVerificationView,
  'contactEmailAddress' | 'verificationId'
>

export type AcceptingStoresData = SearchAcceptingStoresInProjectQuery['stores'][number]
