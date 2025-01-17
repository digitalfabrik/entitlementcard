import { Extension } from './extensions'

export const EMAIL_NOTIFICATION_EXTENSION_NAME = 'emailNotification'
type EmailNotificationExtensionState = { [EMAIL_NOTIFICATION_EXTENSION_NAME]: string }

const fromString = (value: string): EmailNotificationExtensionState => ({ [EMAIL_NOTIFICATION_EXTENSION_NAME]: value })
const toString = ({ emailNotification }: EmailNotificationExtensionState): string => emailNotification

const EMailNotificationExtension: Extension<EmailNotificationExtensionState> = {
  name: EMAIL_NOTIFICATION_EXTENSION_NAME,
  Component: () => null,
  getInitialState: () => ({ [EMAIL_NOTIFICATION_EXTENSION_NAME]: '' }),
  causesInfiniteLifetime: () => false,
  getProtobufData: () => ({}),
  isValid: () => true,
  fromString,
  toString,
  fromSerialized: fromString,
  serialize: toString,
}

export default EMailNotificationExtension
