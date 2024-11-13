import { FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'

import FormErrorMessage from '../../bp-modules/self-service/components/FormErrorMessage'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import ClearInputButton from './components/ClearInputButton'
import { Extension, ExtensionComponentProps } from './extensions'

export const KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME = 'koblenzReferenceNumber'

type KoblenzReferenceNumberExtensionState = { [KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME]: string }

const KoblenzReferenceNumberMinLength = 4
const KoblenzReferenceNumberMaxLength = 15
const hasSpecialChars = (referenceNr: string): boolean => /[`!@#$%^&*()_+\-=\]{};':"\\|,<>?~]/.test(referenceNr)
const hasInvalidLength = (referenceNumberLength: number): boolean =>
  referenceNumberLength < KoblenzReferenceNumberMinLength || referenceNumberLength > KoblenzReferenceNumberMaxLength

const KoblenzReferenceNumberExtensionForm = ({
  value,
  setValue,
  isValid,
  showRequired,
}: ExtensionComponentProps<KoblenzReferenceNumberExtensionState>): ReactElement => {
  const [touched, setTouched] = useState(false)
  const { viewportSmall } = useWindowDimensions()
  const { koblenzReferenceNumber } = value
  const showErrorMessage = touched || showRequired
  const clearInput = () => setValue({ koblenzReferenceNumber: '' })

  const getErrorMessage = (): string | null => {
    const errors: string[] = []
    if (hasSpecialChars(value.koblenzReferenceNumber)) {
      errors.push('Das Aktenzeichen enthält ungültige Sonderzeichen.')
    }
    if (hasInvalidLength(value.koblenzReferenceNumber.length)) {
      errors.push(
        `Das Aktenzeichen muss eine Länge zwischen ${KoblenzReferenceNumberMinLength} und ${KoblenzReferenceNumberMaxLength} haben.`
      )
    }
    return errors.join(' ')
  }

  const updateReferenceNumber = (koblenzReferenceNumber: string) => {
    setValue({ koblenzReferenceNumber })
    if (!touched) {
      setTouched(true)
    }
  }

  return (
    <FormGroup label='Referenznummer' labelFor='koblenz-reference-number-input'>
      <InputGroup
        fill
        large={viewportSmall}
        id='koblenz-reference-number-input'
        placeholder='5.012.067.281, 000D000001, 99478'
        intent={isValid || (!touched && !showRequired) ? undefined : Intent.DANGER}
        value={koblenzReferenceNumber}
        rightElement={
          <ClearInputButton viewportSmall={viewportSmall} onClick={clearInput} input={koblenzReferenceNumber} />
        }
        onChange={event => updateReferenceNumber(event.target.value)}
      />
      {showErrorMessage && <FormErrorMessage errorMessage={getErrorMessage()} />}
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
  isValid: state =>
    state.koblenzReferenceNumber.length >= KoblenzReferenceNumberMinLength &&
    state.koblenzReferenceNumber.length <= KoblenzReferenceNumberMaxLength,
  fromString: value => ({ koblenzReferenceNumber: value }),
  toString: state => state.koblenzReferenceNumber,
}

export default KoblenzReferenceNumberExtension
