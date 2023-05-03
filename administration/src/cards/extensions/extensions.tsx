import { PartialMessage } from '@bufbuild/protobuf'

import { CardExtensions } from '../../generated/card_pb'
import { BavariaCardTypeExtension } from './BavariaCardTypeExtension'
import { BirthdayExtension } from './BirthdayExtension'
import { NuernbergPassNumberExtension } from './NuernbergPassNumberExtension'
import { RegionExtension } from './RegionExtension'

export abstract class Extension<T, R> {
  public state: T | null = null
  abstract setInitialState(args: R): void
  abstract isValid(): boolean
  abstract createForm(onChange: () => void): React.ReactElement | null
  abstract causesInfiniteLifetime(): boolean
  abstract setProtobufData(message: PartialMessage<CardExtensions>): void
}

export type ExtensionClass =
  | typeof BavariaCardTypeExtension
  | typeof BirthdayExtension
  | typeof NuernbergPassNumberExtension
  | typeof RegionExtension
export type ExtensionInstance = InstanceType<ExtensionClass>
