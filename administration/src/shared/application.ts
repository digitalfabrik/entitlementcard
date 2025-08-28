import { AlertColor } from '@mui/material'

import { ApplicationStatus } from '../generated/graphql'
import { JsonField } from './components/JsonFieldView'

type ApplicationJsonValue = {
  jsonValue: string
}

/** A type where the 'jsonValue' is already parsed into an object. */
export type ApplicationParsedJsonValue<T extends ApplicationJsonValue> = {
  [K in keyof Omit<T, 'jsonValue'>]: T[K]
} & {
  jsonValue: JsonField<'Array'>
}

export type ApplicationWithoutVerifications<T extends ApplicationJsonValue> = Omit<
  ApplicationParsedJsonValue<T>,
  'verifications'
>

/** Return an application object with the 'jsonValue' property already parsed */
export const parseApplication = <T extends ApplicationJsonValue>(rawApplication: T): ApplicationParsedJsonValue<T> => ({
  ...rawApplication,
  /** Application data, already parsed from JSON. */
  jsonValue: JSON.parse(rawApplication.jsonValue),
})

export const getAlertSeverityByApplicationStatus = (applicationStatus: ApplicationStatus): AlertColor | undefined => {
  switch (applicationStatus) {
    case ApplicationStatus.Pending:
      return undefined
    case ApplicationStatus.Approved:
    case ApplicationStatus.ApprovedCardCreated:
      return 'success'
    case ApplicationStatus.Rejected:
      return 'error'
    case ApplicationStatus.Withdrawn:
      return 'success'
  }
}

export const applicationWasAlreadyProcessed = (status: ApplicationStatus): boolean =>
  status === ApplicationStatus.Approved ||
  status === ApplicationStatus.ApprovedCardCreated ||
  status === ApplicationStatus.Rejected
