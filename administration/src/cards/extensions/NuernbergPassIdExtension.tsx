import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

import { NuernergPassIdentifier } from '../../generated/card_pb'
import { Extension, ExtensionComponentProps } from './extensions'

export const NUERNBERG_PASS_ID_EXTENSION_NAME = 'nuernbergPassId'

type NuernbergPassIdExtensionState = { [NUERNBERG_PASS_ID_EXTENSION_NAME]: number | null }

const nuernbergPassIdLength = 10

const NuernbergPassIdForm = ({
  value,
  setValue,
  isValid,
}: ExtensionComponentProps<NuernbergPassIdExtensionState>): ReactElement => (
  <FormGroup label='Nürnberg-Pass-ID' labelFor='nuernberg-pass-id-input' intent={isValid ? undefined : Intent.DANGER}>
    <InputGroup
      id='nuernberg-pass-id-input'
      placeholder='12345678'
      intent={isValid ? undefined : Intent.DANGER}
      value={value.nuernbergPassId?.toString() ?? ''}
      maxLength={nuernbergPassIdLength}
      onChange={event => {
        const value = event.target.value
        if (value.length <= nuernbergPassIdLength) {
          const parsedNumber = Number.parseInt(value, 10)
          setValue({ nuernbergPassId: Number.isNaN(parsedNumber) ? null : parsedNumber })
        }
      }}
    />
  </FormGroup>
)

const NuernbergPassIdExtension: Extension<NuernbergPassIdExtensionState> = {
  name: NUERNBERG_PASS_ID_EXTENSION_NAME,
  getInitialState: () => ({ nuernbergPassId: null }),
  Component: NuernbergPassIdForm,
  causesInfiniteLifetime: () => false,
  getProtobufData: state => ({
    extensionNuernbergPassId: {
      identifier: NuernergPassIdentifier.passId,
      passId: state.nuernbergPassId ?? undefined,
    },
  }),
  isValid: ({ nuernbergPassId }) =>
    nuernbergPassId !== null && nuernbergPassId > 0 && nuernbergPassId < 10 ** nuernbergPassIdLength,
  fromString: value => {
    const nuernbergPassId = parseInt(value, 10)
    return { nuernbergPassId: Number.isNaN(nuernbergPassId) ? null : nuernbergPassId }
  },
  toString: state => state.nuernbergPassId?.toString() ?? '',
}

export default NuernbergPassIdExtension
