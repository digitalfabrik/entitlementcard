import type { Extension } from './extensions'

export const FREINET_USER_ID_EXTENSION_NAME = 'freinetUserId'
type FreinetUserIdExtensionState = { [FREINET_USER_ID_EXTENSION_NAME]: string }

const fromString = (value: string): FreinetUserIdExtensionState => ({
  [FREINET_USER_ID_EXTENSION_NAME]: value,
})
const toString = ({ freinetUserId }: FreinetUserIdExtensionState): string => freinetUserId

const FreinetUserIdExtension: Extension<FreinetUserIdExtensionState> = {
  name: FREINET_USER_ID_EXTENSION_NAME,
  Component: () => null,
  getInitialState: () => ({ [FREINET_USER_ID_EXTENSION_NAME]: '' }),
  causesInfiniteLifetime: () => false,
  getProtobufData: () => ({}),
  isValid: () => true,
  fromString,
  toString,
  fromSerialized: fromString,
  serialize: toString,
  isMandatory: false,
}

export default FreinetUserIdExtension
