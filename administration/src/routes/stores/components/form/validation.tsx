import React, { ReactElement } from 'react'
import { Trans } from 'react-i18next'

export const DESCRIPTION_MAX_CHARS = 2000
const VALIDATION_CONSTANTS = {
  NAME: { min: 3, max: 150 },
  STREET: { min: 3, max: 100 },
  CITY: { min: 3, max: 100 },
  POSTAL_CODE: { LENGTH: 5 },
}

const ADDRESS_REGEX = /^[a-zA-ZäöüÄÖÜß0-9\s.-]+$/

export type FormValidation = {
  invalid: boolean
  message: string | ReactElement | null
}

// Hilfsfunktionen für häufig verwendete Validierungen
const requiredFieldError = (): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey='storeForm:errorRequiredField' />,
})

const lengthError = (i18nKey: string, min: number, max: number): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey={i18nKey} values={{ min, max }} />,
})

const validResult = (): FormValidation => ({
  invalid: false,
  message: null,
})

const specialCharacterError = (i18nKey: string): FormValidation => ({
  invalid: true,
  message: <Trans i18nKey={i18nKey} />,
})

const validateFieldWithLength = (
  value: string | undefined,
  { min, max }: { min: number; max: number },
  lengthErrorKey: string
): FormValidation => {
  if (!value) {
    return requiredFieldError()
  }

  if (value.length < min || value.length > max) {
    return lengthError(lengthErrorKey, min, max)
  }

  return validResult()
}

export const nameValidation = (name: string | undefined): FormValidation =>
  validateFieldWithLength(name, VALIDATION_CONSTANTS.NAME, 'storeForm:errorNameInvalidMaxMinChars')

export const streetValidation = (street: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    street,
    VALIDATION_CONSTANTS.STREET,
    'storeForm:errorStreetInvalidMaxMinChars'
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (!ADDRESS_REGEX.test(street!)) {
    return specialCharacterError('storeForm:errorStreetValidationSpecialCharacters')
  }
  return validResult()
}

export const cityValidation = (city: string | undefined): FormValidation => {
  const lengthValidation = validateFieldWithLength(
    city,
    VALIDATION_CONSTANTS.CITY,
    'storeForm:errorCityInvalidMaxMinChars'
  )

  if (lengthValidation.invalid) {
    return lengthValidation
  }

  if (!ADDRESS_REGEX.test(city!)) {
    return specialCharacterError('storeForm:errorCityValidationSpecialCharacters')
  }
  return validResult()
}

export const postalCodeValidation = (postalCode: string | undefined): FormValidation => {
  if (!postalCode) {
    return requiredFieldError()
  }

  if (postalCode.length !== VALIDATION_CONSTANTS.POSTAL_CODE.LENGTH) {
    return {
      invalid: true,
      message: <Trans i18nKey='storeForm:errorPostalCodeInvalidLength' />,
    }
  }
  return validResult()
}

export const descriptionValidation = (description?: string): FormValidation => {
  if (description && description.length > DESCRIPTION_MAX_CHARS) {
    return {
      invalid: true,
      message: <Trans i18nKey='storeForm:errorDescriptionInvalidMaxChars' values={{ max: DESCRIPTION_MAX_CHARS }} />,
    }
  }
  return validResult()
}

export const coordinatesInvalid = (latitude?: number, longitude?: number): boolean =>
  latitude === undefined || longitude === undefined
