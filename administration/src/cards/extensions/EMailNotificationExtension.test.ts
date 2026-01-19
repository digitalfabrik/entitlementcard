import EMailNotificationExtension, {
  EMAIL_NOTIFICATION_EXTENSION_NAME,
} from './EMailNotificationExtension'

describe('EMailNotificationExtension', () => {
  const testEmail = 'test@example.com'
  const emailState = { emailNotification: testEmail }
  it('should have the correct extension name', () => {
    expect(EMailNotificationExtension.name).toBe('emailNotification')
  })

  it('should return empty string as initial state', () => {
    const initialState = EMailNotificationExtension.getInitialState()
    expect(initialState[EMAIL_NOTIFICATION_EXTENSION_NAME]).toBe('')
  })

  it('should return empty object for protobuf data', () => {
    expect(EMailNotificationExtension.getProtobufData(emailState)).toEqual({})
  })

  it('should always be valid', () => {
    expect(EMailNotificationExtension.isValid(emailState)).toBe(true)
  })

  it('should correctly convert from string', () => {
    const result = EMailNotificationExtension.fromString(testEmail)
    expect(result).toEqual({ emailNotification: testEmail })
  })

  it('should correctly convert to string', () => {
    const result = EMailNotificationExtension.toString(emailState)
    expect(result).toBe(testEmail)
  })

  it('should handle serialization and deserialization correctly', () => {
    const serialized = EMailNotificationExtension.serialize({
      [EMAIL_NOTIFICATION_EXTENSION_NAME]: testEmail,
    })
    const deserialized = EMailNotificationExtension.fromSerialized(serialized)
    expect(deserialized).toEqual({ emailNotification: testEmail })
  })

  it('should not be mandatory', () => {
    expect(EMailNotificationExtension.isMandatory).toBe(false)
  })
})
