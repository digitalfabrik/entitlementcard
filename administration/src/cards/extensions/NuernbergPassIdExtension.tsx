import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { NuernergPassIdentifier } from '../../generated/card_pb'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import CardTextField from './components/CardTextField'
import ClearInputButton from './components/ClearInputButton'
import type { Extension, ExtensionComponentProps } from './extensions'

export const NUERNBERG_PASS_ID_EXTENSION_NAME = 'nuernbergPassId'

type NuernbergPassIdExtensionState = { [NUERNBERG_PASS_ID_EXTENSION_NAME]: number | null }

const nuernbergPassIdLength = 9

const NuernbergPassIdForm = ({
  value,
  setValue,
  isValid,
}: ExtensionComponentProps<NuernbergPassIdExtensionState>): ReactElement => {
  const { t } = useTranslation('extensions')
  const { viewportSmall } = useWindowDimensions()
  const { nuernbergPassId } = value
  const clearInput = () => setValue({ nuernbergPassId: null })

  return (
    <CardTextField
      id='nuernberg-pass-id-input'
      placeholder='12345678'
      label='Nürnberg-Pass-ID'
      value={value.nuernbergPassId?.toString() ?? ''}
      onChange={value => {
        if (value.length <= nuernbergPassIdLength) {
          const parsedNumber = Number.parseInt(value, 10)
          setValue({ nuernbergPassId: Number.isNaN(parsedNumber) ? null : parsedNumber })
        }
      }}
      showError={!isValid}
      inputProps={{
        sx: { paddingRight: 0 },
        endAdornment: (
          <ClearInputButton viewportSmall={viewportSmall} onClick={clearInput} input={nuernbergPassId?.toString()} />
        ),
        inputProps: {
          max: nuernbergPassIdLength,
        },
      }}
      errorMessage={t('nuernbergPassIdError')}
    />
  )
}

const fromString = (value: string): NuernbergPassIdExtensionState => {
  const nuernbergPassId = parseInt(value, 10)
  return { nuernbergPassId: Number.isNaN(nuernbergPassId) ? null : nuernbergPassId }
}
const toString = ({ nuernbergPassId }: NuernbergPassIdExtensionState): string => nuernbergPassId?.toString() ?? ''

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
  isValid: state => {
    const nuernbergPassId = state?.nuernbergPassId ?? null
    return nuernbergPassId !== null && nuernbergPassId > 0 && nuernbergPassId < 10 ** nuernbergPassIdLength
  },
  fromString,
  toString,
  fromSerialized: fromString,
  serialize: toString,
  isMandatory: true,
}

export default NuernbergPassIdExtension
