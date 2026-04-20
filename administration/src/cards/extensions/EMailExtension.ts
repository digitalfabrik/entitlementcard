import type { Extension } from './extensions'

export const EMAIL_EXTENSION_NAME = 'email'
type EmailExtensionState = { [EMAIL_EXTENSION_NAME]: string }

const fromString = (value: string): EmailExtensionState => ({
  [EMAIL_EXTENSION_NAME]: value,
})
const toString = ({ email }: EmailExtensionState): string => email

const EMailExtension: Extension<EmailExtensionState> = {
  name: EMAIL_EXTENSION_NAME,
  Component: () => null,
  getInitialState: () => ({ [EMAIL_EXTENSION_NAME]: '' }),
  causesInfiniteLifetime: () => false,
  getProtobufData: () => ({}),
  isValid: () => true,
  fromString,
  toString,
  fromSerialized: fromString,
  serialize: toString,
  isMandatory: false,
}

export default EMailExtension
