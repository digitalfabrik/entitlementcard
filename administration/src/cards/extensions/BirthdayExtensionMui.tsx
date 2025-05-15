import { FormGroup as MuiFormGroup } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDatePicker from '../../bp-modules/components/CustomDatePicker'
import FormAlert from '../../bp-modules/self-service/components/FormAlert'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import PlainDate from '../../util/PlainDate'
import type { Extension, ExtensionComponentProps } from './extensions'

export const BIRTHDAY_EXTENSION_MUI_NAME = 'birthdayMui'
export type BirthdayExtensionMuiState = { [BIRTHDAY_EXTENSION_MUI_NAME]: PlainDate | null }

const minBirthday = new PlainDate(1900, 1, 1)

const BirthdayMuiForm = ({
  value,
  setValue,
  isValid,
  showRequired,
}: ExtensionComponentProps<BirthdayExtensionMuiState>): ReactElement => {
  const { t } = useTranslation('extensions')
  const [touched, setTouched] = useState(false)
  const { birthdayMui: birthday } = value
  const showErrorMessage = touched || showRequired
  const projectConfig = useContext(ProjectConfigContext)

  const showBirthdayHint = (): boolean => {
    const today = PlainDate.fromLocalDate(new Date())
    const underAge = today.subtract({ years: 16 })
    return !!(birthday?.isAfter(underAge) && projectConfig.showBirthdayExtensionHint && !birthday.isAfter(today))
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
    <MuiFormGroup>
      <CustomDatePicker
        label={t('birthdayLabel')}
        value={birthday?.toLocalDate() ?? null}
        onBlur={() => setTouched(true)}
        onChange={date => {
          setValue({ birthdayMui: PlainDate.safeFromLocalDate(date) })
        }}
        onClear={() => setValue({ birthdayMui: null })}
        error={!isValid && showErrorMessage}
        disableFuture
        textFieldSlotProps={{
          sx: {
            '.MuiPickersSectionList-root': {
              padding: '5px 0',
            },
          },
        }}
      />
      {showErrorMessage && <FormAlert severity='error' errorMessage={getErrorMessage()} />}
      {showBirthdayHint() && <FormAlert severity='info' errorMessage={t('birthdayHint')} />}
    </MuiFormGroup>
  )
}

const BirthdayExtensionMui: Extension<BirthdayExtensionMuiState> = {
  name: BIRTHDAY_EXTENSION_MUI_NAME,
  Component: BirthdayMuiForm,
  getInitialState: (): BirthdayExtensionMuiState => ({ birthdayMui: null }),
  causesInfiniteLifetime: () => false,
  getProtobufData: ({ birthdayMui }: BirthdayExtensionMuiState) => ({
    extensionBirthday: {
      birthday: birthdayMui?.toDaysSinceEpoch() ?? undefined,
    },
  }),
  isValid: ({ birthdayMui }: BirthdayExtensionMuiState) => {
    if (!birthdayMui) {
      return false
    }
    const today = PlainDate.fromLocalDate(new Date())
    return !birthdayMui.isBefore(minBirthday) && !birthdayMui.isAfter(today)
  },
  fromString: (value: string) => {
    const birthday = PlainDate.safeFromCustomFormat(value)
    return birthday === null ? null : { birthdayMui: birthday }
  },
  toString: ({ birthdayMui }: BirthdayExtensionMuiState) => birthdayMui?.format() ?? '',
  fromSerialized: (value: string) => {
    const birthday = PlainDate.safeFrom(value)
    return birthday === null ? null : { birthdayMui: birthday }
  },
  serialize: ({ birthdayMui }: BirthdayExtensionMuiState) => birthdayMui?.formatISO() ?? '',
  isMandatory: true,
}

export default BirthdayExtensionMui
