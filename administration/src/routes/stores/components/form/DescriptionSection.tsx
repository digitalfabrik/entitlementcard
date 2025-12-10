import { Typography } from '@mui/material'
import React, { ReactElement, useContext, useId } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import CardTextField from '../../../../cards/extensions/components/CardTextField'
import { ProjectConfigContext } from '../../../../project-configs/ProjectConfigContext'
import type { AcceptingStoreFormData, UpdateStoreFunction } from '../../types'
import { descriptionMaxChars, descriptionValidation } from './validation'

const getRemainingCharacters = (description: string) => {
  const remainingCharacters = descriptionMaxChars - description.length
  return remainingCharacters < 0 ? 0 : remainingCharacters
}
const DescriptionSection = ({
  acceptingStore,
  onUpdateStore,
}: {
  acceptingStore?: AcceptingStoreFormData
  onUpdateStore: UpdateStoreFunction
}): ReactElement => {
  const { t } = useTranslation('storeForm')
  const { locales } = useContext(ProjectConfigContext)
  const hasDescriptionDe = acceptingStore?.descriptionDe !== undefined
  const hasDescriptionEn = acceptingStore?.descriptionEn !== undefined
  const descriptionDeLabelId = useId()
  const descriptionEnLabelId = useId()
  return (
    <>
      <Typography variant='h6' marginY={0.5}>
        {t('descriptionSection')}
      </Typography>
      <CardTextField
        id={descriptionDeLabelId}
        label={
          hasDescriptionDe ? (
            <Trans
              i18nKey='storeForm:descriptionRemainingCharactersDe'
              values={{ chars: getRemainingCharacters(acceptingStore.descriptionDe) }}
            />
          ) : (
            <Trans i18nKey='storeForm:descriptionLabelDe' values={{ maxChars: descriptionMaxChars }} />
          )
        }
        placeholder={t('descriptionPlaceholder')}
        value={acceptingStore?.descriptionDe ?? ''}
        onChange={value => onUpdateStore('descriptionDe', value)}
        rows={4}
        multiline
        showError={descriptionValidation(acceptingStore?.descriptionDe).invalid}
        errorMessage={descriptionValidation(acceptingStore?.descriptionDe).message}
      />
      {locales.includes('en') && (
        <CardTextField
          id={descriptionEnLabelId}
          label={
            hasDescriptionEn ? (
              <Trans
                i18nKey='storeForm:descriptionRemainingCharactersEn'
                values={{ chars: getRemainingCharacters(acceptingStore.descriptionEn) }}
              />
            ) : (
              <Trans i18nKey='storeForm:descriptionLabelEn' values={{ maxChars: descriptionMaxChars }} />
            )
          }
          placeholder={t('descriptionPlaceholder')}
          value={acceptingStore?.descriptionEn ?? ''}
          onChange={value => onUpdateStore('descriptionEn', value)}
          rows={4}
          multiline
          showError={descriptionValidation(acceptingStore?.descriptionEn).invalid}
          errorMessage={descriptionValidation(acceptingStore?.descriptionEn).message}
        />
      )}
    </>
  )
}

export default DescriptionSection
