import EMailExtension, { EMAIL_EXTENSION_NAME } from './EMailExtension'

describe('EMailExtension', () => {
  const testEmail = 'test@example.com'
  const emailState = { email: testEmail }
  it('should have the correct extension name', () => {
    expect(EMailExtension.name).toBe('email')
  })

  it('should return empty string as initial state', () => {
    const initialState = EMailExtension.getInitialState()
    expect(initialState[EMAIL_EXTENSION_NAME]).toBe('')
  })

  it('should return empty object for protobuf data', () => {
    expect(EMailExtension.getProtobufData(emailState)).toEqual({})
  })

  it('should always be valid', () => {
    expect(EMailExtension.isValid(emailState)).toBe(true)
  })

  it('should correctly convert from string', () => {
    const result = EMailExtension.fromString(testEmail)
    expect(result).toEqual({ email: testEmail })
  })

  it('should correctly convert to string', () => {
    const result = EMailExtension.toString(emailState)
    expect(result).toBe(testEmail)
  })

  it('should handle serialization and deserialization correctly', () => {
    const serialized = EMailExtension.serialize({
      [EMAIL_EXTENSION_NAME]: testEmail,
    })
    const deserialized = EMailExtension.fromSerialized(serialized)
    expect(deserialized).toEqual({ email: testEmail })
  })

  it('should not be mandatory', () => {
    expect(EMailExtension.isMandatory).toBe(false)
  })
})
