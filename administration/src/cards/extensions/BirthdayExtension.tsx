import { FormGroup } from '@blueprintjs/core'
import React, { ReactElement, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import CustomDatePicker from '../../bp-modules/components/CustomDatePicker'
import FormErrorMessage from '../../bp-modules/self-service/components/FormErrorMessage'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import PlainDate from '../../util/PlainDate'
import { Extension, ExtensionComponentProps } from './extensions'

export const BIRTHDAY_EXTENSION_NAME = 'birthday'
export type BirthdayExtensionState = { [BIRTHDAY_EXTENSION_NAME]: PlainDate | null }

const minBirthday = new PlainDate(1900, 1, 1)
const getInitialState = (): BirthdayExtensionState => ({ birthday: null })

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
  const { t } = useTranslation('application')

  const isBirthdayHintEnabled = (): boolean => {
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
    if (isBirthdayHintEnabled()) {
      return t('extensions.birthdayHint')
    }

    return null
  }

  const changeBirthday = (date: Date | null) => {
    setValue({ birthday: PlainDate.safeFromLocalDate(date) })
  }

  return (
    <FormGroup label={t('birthdayLabel')}>
      <CustomDatePicker
        date={birthday?.toLocalDate() ?? null}
        onBlur={() => setTouched(true)}
        onChange={changeBirthday}
        onClear={() => setValue({ birthday: null })}
        isValid={isValid || !showErrorMessage}
        isHint={isBirthdayHintEnabled()}
        maxDate={new Date()}
        disableFuture
      />
      {showErrorMessage && (
        <FormErrorMessage
          style={{ color: isBirthdayHintEnabled() ? 'black' : undefined }}
          errorMessage={getErrorMessage()}
        />
      )}
    </FormGroup>
  )
}

const BirthdayExtension: Extension<BirthdayExtensionState> = {
  name: BIRTHDAY_EXTENSION_NAME,
  Component: BirthdayForm,
  getInitialState,
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
    return !birthday.isBefore(minBirthday) && !birthday.isAfter(today)
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
}

export default BirthdayExtension
