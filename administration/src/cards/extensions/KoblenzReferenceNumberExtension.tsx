import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useWindowDimensions from '../../hooks/useWindowDimensions'
import CardTextField from './components/CardTextField'
import ClearInputButton from './components/ClearInputButton'
import type { Extension, ExtensionComponentProps } from './extensions'

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
  const { t } = useTranslation('extensions')
  const [touched, setTouched] = useState(false)
  const { viewportSmall } = useWindowDimensions()
  const { koblenzReferenceNumber } = value
  const showErrorMessage = touched || showRequired
  const clearInput = () => setValue({ koblenzReferenceNumber: '' })

  const getErrorMessage = (): string | null => {
    const errors: string[] = []
    if (hasSpecialChars(value.koblenzReferenceNumber)) {
      errors.push(t('referenceNrSpecialCharactersError'))
    }
    if (hasInvalidLength(value.koblenzReferenceNumber.length)) {
      errors.push(
        t('referenceNrInvalidLengthError', { KoblenzReferenceNumberMinLength, KoblenzReferenceNumberMaxLength })
      )
    }
    return errors.join(' ')
  }

  return (
    <CardTextField
      id='koblenz-reference-number-input'
      placeholder='5.031.025.281, 000D000001, 91459'
      label={t('referenceNrLabel')}
      value={koblenzReferenceNumber}
      onChange={koblenzReferenceNumber => setValue({ koblenzReferenceNumber })}
      onBlur={() => setTouched(true)}
      showError={!isValid && showErrorMessage}
      inputProps={{
        sx: { paddingRight: 0 },
        endAdornment: (
          <ClearInputButton viewportSmall={viewportSmall} onClick={clearInput} input={koblenzReferenceNumber} />
        ),
        inputProps: {
          max: KoblenzReferenceNumberMaxLength,
          min: KoblenzReferenceNumberMinLength,
        },
      }}
      errorMessage={getErrorMessage()}
    />
  )
}

const fromString = (value: string): KoblenzReferenceNumberExtensionState => ({ koblenzReferenceNumber: value })
const toString = ({ koblenzReferenceNumber }: KoblenzReferenceNumberExtensionState): string => koblenzReferenceNumber

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
      koblenzReferenceNumber.length <= KoblenzReferenceNumberMaxLength &&
      !hasSpecialChars(koblenzReferenceNumber)
    )
  },
  fromString,
  toString,
  fromSerialized: fromString,
  serialize: toString,
  isMandatory: true,
}

export default KoblenzReferenceNumberExtension
