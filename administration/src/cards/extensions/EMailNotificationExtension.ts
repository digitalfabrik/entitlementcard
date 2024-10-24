import { Extension } from './extensions'

export const EMAIL_NOTIFICATION_EXTENSION_NAME = 'emailNotification'
type EmailNotificationExtensionState = { [EMAIL_NOTIFICATION_EXTENSION_NAME]: string }

const EMailNotificationExtension: Extension<EmailNotificationExtensionState> = {
  name: EMAIL_NOTIFICATION_EXTENSION_NAME,
  Component: () => null,
  getInitialState: () => ({ [EMAIL_NOTIFICATION_EXTENSION_NAME]: '' }),
  causesInfiniteLifetime: () => false,
  getProtobufData: () => ({}),
  isValid: () => true,
  fromString: (value: string) => ({ [EMAIL_NOTIFICATION_EXTENSION_NAME]: value }),
  toString: (state): string => state[EMAIL_NOTIFICATION_EXTENSION_NAME],
}

export default EMailNotificationExtension
