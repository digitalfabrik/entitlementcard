import { Extension } from '.'
import { Region } from '../../generated/graphql'

type RegionState = { regionId: number }

export const region_extension: Extension<RegionState, Region> = {
  getInitialState: region => ({ regionId: region.id }),
  causesInfiniteLifetime: () => false,
  createForm: () => null,
  setProtobufData: (state, message) => {
    message.extensionRegion = {
      regionId: state.regionId,
    }
  },
  isValid: state => state !== null,
}

export default region_extension
