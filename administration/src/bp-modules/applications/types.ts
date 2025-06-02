import { GetApplicationsQuery } from '../../generated/graphql'

export type GetApplicationsType = GetApplicationsQuery['applications'][number]

export type GetApplicationsVerificationType = GetApplicationsType['verifications'][number]
