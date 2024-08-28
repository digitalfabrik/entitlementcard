import { PartialMessage } from '@bufbuild/protobuf'

import { CardExtensions } from '../../generated/card_pb'
import { Region } from '../../generated/graphql'
import { Extension } from './extensions'

type RegionState = { regionId: number }

class RegionExtension extends Extension<RegionState, Region> {
  public readonly name = RegionExtension.name

  setInitialState(region: Region): void {
    this.state = { regionId: region.id }
  }
  causesInfiniteLifetime(): boolean {
    return false
  }
  createForm(): null {
    return null
  }
  setProtobufData(message: PartialMessage<CardExtensions>): void {
    // eslint-disable-next-line no-param-reassign
    message.extensionRegion = {
      regionId: this.state?.regionId,
    }
  }
  isValid(): boolean {
    return this.state !== null
  }

  fromString(state: string): void {
    this.state = { regionId: parseInt(state, 10) }
  }
  toString(): string {
    return this.state ? `${this.state.regionId}` : ''
  }
}

export default RegionExtension
