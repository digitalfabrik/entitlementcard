import { PartialMessage } from '@bufbuild/protobuf'

import { CardExtensions } from '../../generated/card_pb'

export type Extension<T, R> = {
  getInitialState: (args: R) => T | null
  isValid: (state: T | null) => boolean
  createForm: (state: T | null, setState: (state: T | null) => void) => React.ReactElement | null
  causesInfiniteLifetime: (state: T) => boolean
  setProtobufData: (state: T, message: PartialMessage<CardExtensions>) => void
}

export type ExtensionHolder<T, R> = {
  state: T | null
  extension: Extension<T, R>
}

export function createExtensionHolder<T, R>(extension: Extension<T, R>, initialStateArg: R): ExtensionHolder<T, R> {
  return {
    state: extension.getInitialState(initialStateArg),
    extension,
  }
}

export { default as bavariaCardTypeExtension } from './bavariaCardTypeExtension'
export { default as birthdayExtension } from './birthdayExtension'
export { default as nuernbergPassIdExtension } from './nuernbergPassIdExtension'
export { default as nuernbergPassNumberExtension } from './nuernbergPassNumberExtension'
export { default as regionExtension } from './regionExtension'
