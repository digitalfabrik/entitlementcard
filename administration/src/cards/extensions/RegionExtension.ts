import { Region } from '../../generated/graphql'
import { Extension } from './extensions'

export const REGION_EXTENSION_NAME = 'regionId'
export type RegionExtensionState = { [REGION_EXTENSION_NAME]: number }

const fromString = (value: string): RegionExtensionState => ({ regionId: parseInt(value, 10) })
const toString = ({ regionId }: RegionExtensionState): string => regionId.toString()

const RegionExtension: Extension<RegionExtensionState> = {
  name: REGION_EXTENSION_NAME,
  Component: () => null,
  getInitialState: (region?: Region) => ({ regionId: region!.id }),
  causesInfiniteLifetime: () => false,
  getProtobufData: ({ regionId }: RegionExtensionState) => ({
    extensionRegion: {
      regionId,
    },
  }),
  isValid: () => true,
  fromString,
  fromSerialized: fromString,
  serialize: toString,
  isMandatory: true,
}

export default RegionExtension
