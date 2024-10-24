import { Region } from '../../generated/graphql'
import { Extension } from './extensions'

export const REGION_EXTENSION_NAME = 'regionId'
export type RegionExtensionState = { [REGION_EXTENSION_NAME]: number }

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
  fromString: (value: string) => ({ regionId: parseInt(value, 10) }),
  toString: ({ regionId }: RegionExtensionState) => regionId.toString(),
}

export default RegionExtension
