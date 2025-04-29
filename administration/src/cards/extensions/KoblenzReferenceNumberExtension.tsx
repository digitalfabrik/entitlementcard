import { FormGroup, TextField } from '@mui/material'
import React, { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomFormLabel from '../../bp-modules/self-service/components/CustomFormLabel'
import FormAlert from '../../bp-modules/self-service/components/FormAlert'
import useWindowDimensions from '../../hooks/useWindowDimensions'
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
  const removeEndAdornmentPadding = { '& .MuiFormHelperText-root': { margin: '0px' } }

  return (
    <FormGroup>
      <CustomFormLabel htmlFor='koblenz-reference-number-input' label={t('referenceNrLabel')} />
      <TextField
        id='koblenz-reference-number-input'
        placeholder='5.031.025.281, 000D000001, 91459'
        fullWidth
        size='small'
        value={koblenzReferenceNumber}
        onBlur={() => setTouched(true)}
        onChange={e => setValue({ koblenzReferenceNumber: e.target.value })}
        error={!isValid && showErrorMessage}
        helperText={showErrorMessage ? <FormAlert errorMessage={getErrorMessage()} /> : null}
        sx={removeEndAdornmentPadding}
        InputProps={{
          sx: { paddingRight: 0 },
          endAdornment: (
            <ClearInputButton viewportSmall={viewportSmall} onClick={clearInput} input={koblenzReferenceNumber} />
          ),
        }}
      />
    </FormGroup>
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
