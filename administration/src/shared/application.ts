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

/** Return an application object with the 'jsonValue' property already parsed */
export const parseApplication = <T extends ApplicationJsonValue>(rawApplication: T): ApplicationParsedJsonValue<T> => ({
  ...rawApplication,
  /** Application data, already parsed from JSON. */
  jsonValue: JSON.parse(rawApplication.jsonValue),
})
