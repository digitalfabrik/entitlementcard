import { PartialMessage } from '@bufbuild/protobuf'
import { ReactElement } from 'react'

import { CardExtensions } from '../../generated/card_pb'
import AdressExtensions from './AdressFieldExtensons'
import BavariaCardTypeExtension from './BavariaCardTypeExtension'
import BirthdayExtension from './BirthdayExtension'
import NuernbergPassNumberExtension from './NuernbergPassNumberExtension'
import RegionExtension from './RegionExtension'

export interface JSONExtension<T> {
  name: string
  state: T | null
}

export abstract class Extension<T, R> implements JSONExtension<T> {
  public abstract readonly name: string
  public state: T | null = null
  abstract setInitialState(args: R, ...xargs: any[]): void
  abstract isValid(): boolean
  abstract createForm(onChange: () => void): ReactElement | null
  abstract causesInfiniteLifetime(): boolean
  setProtobufData?(message: PartialMessage<CardExtensions>): void
  abstract fromString(state: string): void
  abstract toString(): string
}

export type ExtensionClass =
  | typeof BavariaCardTypeExtension
  | typeof BirthdayExtension
  | typeof NuernbergPassNumberExtension
  | typeof RegionExtension
  | (typeof AdressExtensions)[number]
export type ExtensionInstance = InstanceType<ExtensionClass>
