import { PartialMessage } from '@bufbuild/protobuf'

import { CardExtensions } from '../../generated/card_pb'
import { Region } from '../../generated/graphql'
import { Extension } from './extensions'

type RegionState = { regionId: number }

export class RegionExtension extends Extension<RegionState, Region> {
  setInitialState(region: Region) {
    this.state = { regionId: region.id }
  }
  causesInfiniteLifetime() {
    return false
  }
  createForm() {
    return null
  }
  setProtobufData(message: PartialMessage<CardExtensions>) {
    message.extensionRegion = {
      regionId: this.state?.regionId,
    }
  }
  isValid() {
    return this.state !== null
  }
}
