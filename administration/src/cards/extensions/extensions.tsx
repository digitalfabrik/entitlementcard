import { PartialMessage } from '@bufbuild/protobuf'
import { ReactElement } from 'react'

import { CardExtensions } from '../../generated/card_pb'
import AddressExtensions from './AddressFieldExtensions'
import BavariaCardTypeExtension from './BavariaCardTypeExtension'
import BirthdayExtension from './BirthdayExtension'
import EMailNotificationExtension from './EMailNotificationExtension'
import KoblenzReferenceNumberExtension from './KoblenzReferenceNumberExtension'
import NuernbergPassIdExtension from './NuernbergPassIdExtension'
import RegionExtension from './RegionExtension'
import StartDayExtension from './StartDayExtension'

export const findExtension = <E extends ExtensionClass>(
  array: ExtensionInstance[],
  extension: E
): InstanceType<E> | undefined => array.find(e => e instanceof extension) as InstanceType<E> | undefined

export type JSONExtension<T> = {
  name: string
  state: T | null
}

export abstract class Extension<T, R> implements JSONExtension<T> {
  public abstract readonly name: string
  public state: T | null = null
  abstract setInitialState(args: R, ...xargs: unknown[]): void
  abstract isValid(): boolean
  abstract createForm(onChange: () => void, viewportSmall?: boolean): ReactElement | null
  abstract causesInfiniteLifetime(): boolean
  setProtobufData?(message: PartialMessage<CardExtensions>): void
  abstract fromString(state: string): void
  abstract toString(): string
}

export type ExtensionClass =
  | typeof BavariaCardTypeExtension
  | typeof BirthdayExtension
  | typeof NuernbergPassIdExtension
  | typeof RegionExtension
  | typeof StartDayExtension
  | typeof EMailNotificationExtension
  | typeof KoblenzReferenceNumberExtension
  | (typeof AddressExtensions)[number]
export type ExtensionInstance = InstanceType<ExtensionClass>
