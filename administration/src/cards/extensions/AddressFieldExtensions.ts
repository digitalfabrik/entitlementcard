import { Card } from '../Card'
import { Extension } from './extensions'

export const ADDRESS_LINE_1_EXTENSION = 'addressLine1'
export const ADDRESS_LINE_2_EXTENSION = 'addressLine2'
export const ADDRESS_PLZ_EXTENSION = 'addressPlz'
export const ADDRESS_LOCATION_EXTENSION = 'addressLocation'

type AddressFieldExtension =
  | typeof ADDRESS_LINE_1_EXTENSION
  | typeof ADDRESS_LINE_2_EXTENSION
  | typeof ADDRESS_PLZ_EXTENSION
  | typeof ADDRESS_LOCATION_EXTENSION
type AddressFieldExtensionState<T extends AddressFieldExtension> = Record<T, string>

const getAddressFieldExtension = <T extends AddressFieldExtension>(
  name: T
): Extension<AddressFieldExtensionState<T>> => ({
  name,
  Component: () => null,
  getInitialState: () => ({ [name]: '' } as AddressFieldExtensionState<T>),
  causesInfiniteLifetime: () => false,
  getProtobufData: () => ({}),
  isValid: () => true,
  fromString: (value: string) => ({ [name]: value } as AddressFieldExtensionState<T>),
  toString: (state): string => state[name],
})

export const AddressLine1Extension = getAddressFieldExtension(ADDRESS_LINE_1_EXTENSION)
export const AddressLine2Extension = getAddressFieldExtension(ADDRESS_LINE_2_EXTENSION)
export const AddressPlzExtension: Extension<AddressFieldExtensionState<typeof ADDRESS_PLZ_EXTENSION>> = {
  ...getAddressFieldExtension(ADDRESS_PLZ_EXTENSION),
  isValid: (state): boolean => state.addressPlz.length === 0 || /^\d{5}$/.test(state.addressPlz),
}
export const AddressLocationExtension = getAddressFieldExtension(ADDRESS_LOCATION_EXTENSION)

const AddressExtensions = [AddressLine1Extension, AddressLine2Extension, AddressPlzExtension, AddressLocationExtension]

export const getAddressFieldExtensionsValues = (card: Card): (string | undefined)[] => [
  card.extensions[ADDRESS_LINE_1_EXTENSION],
  card.extensions[ADDRESS_LINE_2_EXTENSION],
  card.extensions[ADDRESS_PLZ_EXTENSION],
  card.extensions[ADDRESS_LOCATION_EXTENSION],
]

export default AddressExtensions
