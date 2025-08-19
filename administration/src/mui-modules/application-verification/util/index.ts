import { ApplicationStatus } from '../../../generated/graphql'

export const applicationWasAlreadyProcessed = (status: ApplicationStatus): boolean =>
  status === ApplicationStatus.Approved ||
  status === ApplicationStatus.ApprovedCardCreated ||
  status === ApplicationStatus.Rejected
