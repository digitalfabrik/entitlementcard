import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import React, { ReactElement } from 'react'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import ClearInputButton from './components/ClearInputButton'
import { Extension, ExtensionComponentProps } from './extensions'

export const KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME = 'koblenzReferenceNumber'

type KoblenzReferenceNumberExtensionState = { [KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME]: string }

const KoblenzReferenceNumberMinLength = 4
const KoblenzReferenceNumberMaxLength = 15

const KoblenzReferenceNumberExtensionForm = ({
  value,
  setValue,
  isValid,
}: ExtensionComponentProps<KoblenzReferenceNumberExtensionState>): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const clearInput = () => setValue({ koblenzReferenceNumber: '' })

  return (
    <FormGroup
      label='Referenznummer'
      labelFor='koblenz-reference-number-input'
      intent={isValid ? undefined : Intent.DANGER}>
      <InputGroup
        fill
        large={viewportSmall}
        id='koblenz-reference-number-input'
        placeholder='5.012.067.281, 000D000001, 99478'
        intent={isValid ? undefined : Intent.DANGER}
        value={value.koblenzReferenceNumber}
        minLength={KoblenzReferenceNumberMinLength}
        maxLength={KoblenzReferenceNumberMaxLength}
        rightElement={
          <ClearInputButton viewportSmall={viewportSmall} onClick={clearInput} input={value.koblenzReferenceNumber} />
        }
        onChange={event => {
          const value = event.target.value
          if (value.length <= KoblenzReferenceNumberMaxLength) {
            setValue({ koblenzReferenceNumber: value })
          }
        }}
      />
    </FormGroup>
  )
}

const KoblenzReferenceNumberExtension: Extension<KoblenzReferenceNumberExtensionState> = {
  name: KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME,
  getInitialState: () => ({ koblenzReferenceNumber: '' }),
  Component: KoblenzReferenceNumberExtensionForm,
  causesInfiniteLifetime: () => false,
  getProtobufData: state => ({
    extensionKoblenzReferenceNumber: {
      referenceNumber: state.koblenzReferenceNumber,
    },
  }),
  isValid: state => {
    const koblenzReferenceNumber = state?.koblenzReferenceNumber ?? null
    return (
      koblenzReferenceNumber !== null &&
      koblenzReferenceNumber.length >= KoblenzReferenceNumberMinLength &&
      koblenzReferenceNumber.length <= KoblenzReferenceNumberMaxLength
    )
  },
  fromString: value => ({ koblenzReferenceNumber: value }),
  toString: state => state.koblenzReferenceNumber,
}

export default KoblenzReferenceNumberExtension
