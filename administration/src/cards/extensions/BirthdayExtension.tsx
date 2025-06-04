import { FormGroup } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDatePicker from '../../bp-modules/components/CustomDatePicker'
import FormAlert from '../../bp-modules/self-service/components/FormAlert'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import PlainDate from '../../util/PlainDate'
import type { Extension, ExtensionComponentProps } from './extensions'

export const BIRTHDAY_EXTENSION_NAME = 'birthday'
export type BirthdayExtensionState = { [BIRTHDAY_EXTENSION_NAME]: PlainDate | null }

const minBirthday = new PlainDate(1900, 1, 1)

const BirthdayForm = ({
  value,
  setValue,
  isValid,
  showRequired,
}: ExtensionComponentProps<BirthdayExtensionState>): ReactElement => {
  const { t } = useTranslation('extensions')
  const [touched, setTouched] = useState(false)
  const { birthday } = value
  const showErrorMessage = touched || showRequired
  const projectConfig = useContext(ProjectConfigContext)

  const showBirthdayHint = (): boolean => {
    if (!projectConfig.showBirthdayExtensionHint || !birthday) {
      return false
    }
    const today = PlainDate.fromLocalDate(new Date())
    const underAge = today.subtract({ years: 16 })
    return birthday.isAfter(underAge) && birthday.isBefore(today)
  }

  const getErrorMessage = (): string | null => {
    const today = PlainDate.fromLocalDate(new Date())

    if (!birthday) {
      return t('birthdayMissingError')
    }
    if (birthday.isAfter(today)) {
      return t('birthdayFutureError')
    }

    return null
  }

  return (
    <FormGroup>
      <CustomDatePicker
        value={birthday?.toLocalDate() ?? null}
        onBlur={() => setTouched(true)}
        onChange={date => {
          setValue({ birthday: PlainDate.safeFromLocalDate(date) })
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
      birthday: birthday?.toDaysSinceEpoch() ?? undefined,
    },
  }),
  isValid: ({ birthday }: BirthdayExtensionState) => {
    if (!birthday) {
      return false
    }
    const today = PlainDate.fromLocalDate(new Date())
    return !birthday.isBeforeOrEqual(minBirthday) && !birthday.isAfter(today)
  },
  fromString: (value: string) => {
    const birthday = PlainDate.safeFromCustomFormat(value)
    return birthday === null ? null : { birthday }
  },
  toString: ({ birthday }: BirthdayExtensionState) => birthday?.format() ?? '',
  fromSerialized: (value: string) => {
    const birthday = PlainDate.safeFrom(value)
    return birthday === null ? null : { birthday }
  },
  serialize: ({ birthday }: BirthdayExtensionState) => birthday?.formatISO() ?? '',
  isMandatory: true,
}

export default BirthdayExtension
