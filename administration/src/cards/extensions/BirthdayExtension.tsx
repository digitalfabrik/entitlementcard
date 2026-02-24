import { FormGroup } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Temporal } from 'temporal-polyfill'

import CustomDatePicker from '../../components/CustomDatePicker'
import FormAlert from '../../components/FormAlert'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import {
  formatDateDefaultGerman,
  plainDateToDaysSinceEpoch,
  plainDateToLegacyDate,
  safeFromLocalDate,
  safeParseGermanPlainDateString,
  safeParseISOPlainDate,
} from '../../util/date'
import type { Extension, ExtensionComponentProps } from './extensions'

export const BIRTHDAY_EXTENSION_NAME = 'birthday'
export type BirthdayExtensionState = { [BIRTHDAY_EXTENSION_NAME]: Temporal.PlainDate | null }

export const minBirthday = new Temporal.PlainDate(1900, 1, 1)

const BirthdayForm = ({
  value,
  setValue,
  isValid,
  forceError,
}: ExtensionComponentProps<BirthdayExtensionState>): ReactElement => {
  const { t } = useTranslation('extensions')
  const [interacted, setInteracted] = useState(false)
  const { birthday } = value
  const showErrorMessage = interacted || forceError
  const projectConfig = useContext(ProjectConfigContext)

  const showBirthdayHint = (): boolean => {
    if (!projectConfig.showBirthdayExtensionHint || !birthday) {
      return false
    }
    const today = Temporal.Now.plainDateISO()
    const underAge = today.subtract({ years: 16 })
    return (
      Temporal.PlainDate.compare(birthday, underAge) > 0 &&
      Temporal.PlainDate.compare(birthday, today) <= 0
    )
  }

  const getErrorMessage = (): string | null => {
    const today = Temporal.Now.plainDateISO()

    if (!birthday) {
      return t('birthdayMissingError')
    }
    if (Temporal.PlainDate.compare(birthday, today) > 0) {
      return t('birthdayFutureError')
    }
    if (Temporal.PlainDate.compare(birthday, minBirthday) < 0) {
      return t('birthdayBeforeMinBirthdayError', {
        minBirthday,
      })
    }
    return null
  }

  return (
    <FormGroup>
      <CustomDatePicker
        value={birthday !== null ? plainDateToLegacyDate(birthday) : null}
        onBlur={() => setInteracted(true)}
        onClose={() => setInteracted(true)}
        onChange={date => {
          setValue({ birthday: safeFromLocalDate(date) })
        }}
        onClear={() => setValue({ birthday: null })}
        error={!isValid && showErrorMessage}
        disableFuture
        label={t('birthdayLabel')}
      />
      {showErrorMessage && <FormAlert severity='error' errorMessage={getErrorMessage()} />}
      {showBirthdayHint() && <FormAlert severity='info' errorMessage={t('birthdayHint')} />}
    </FormGroup>
  )
}

const BirthdayExtension: Extension<BirthdayExtensionState> = {
  name: BIRTHDAY_EXTENSION_NAME,
  Component: BirthdayForm,
  getInitialState: (): BirthdayExtensionState => ({ birthday: null }),
  causesInfiniteLifetime: () => false,
  getProtobufData: ({ birthday }: BirthdayExtensionState) => ({
    extensionBirthday: {
      birthday: birthday !== null ? plainDateToDaysSinceEpoch(birthday) : undefined,
    },
  }),
  isValid: ({ birthday }: BirthdayExtensionState) => {
    if (!birthday) {
      return false
    }
    const today = Temporal.Now.plainDateISO()
    return (
      Temporal.PlainDate.compare(birthday, minBirthday) >= 0 &&
      Temporal.PlainDate.compare(birthday, today) <= 0
    )
  },
  fromString: (value: string) => {
    const date = safeParseGermanPlainDateString(value)
    return date !== null
      ? {
          [BIRTHDAY_EXTENSION_NAME]: date,
        }
      : null
  },
  toString: ({ birthday }: BirthdayExtensionState) =>
    birthday !== null ? formatDateDefaultGerman(birthday) : '',
  fromSerialized: (value: string) => {
    const birthday = safeParseISOPlainDate(value)
    return birthday === null ? null : { birthday }
  },
  serialize: ({ birthday }: BirthdayExtensionState) => birthday?.toString() ?? '',
  isMandatory: true,
}

export default BirthdayExtension
