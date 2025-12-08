import { Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import CardTextField from '../../../../cards/extensions/components/CardTextField'
import { ProjectConfigContext } from '../../../../project-configs/ProjectConfigContext'
import type { AcceptingStoreFormData, UpdateStoreFunction } from '../../types'
import { DESCRIPTION_MAX_CHARS, descriptionValidation } from './validation'

const DescriptionSection = ({
  acceptingStore,
  updateStore,
}: {
  acceptingStore?: AcceptingStoreFormData
  updateStore: UpdateStoreFunction
}): ReactElement => {
  const { t } = useTranslation('storeForm')
  const { locales } = useContext(ProjectConfigContext)
  const hasDescriptionDe = acceptingStore?.descriptionDe !== undefined
  const hasDescriptionEn = acceptingStore?.descriptionEn !== undefined
  return (
    <>
      <Typography variant='h6' marginY={0.5}>
        {t('descriptionSection')}
      </Typography>
      <CardTextField
        id='store-descriptionDe-input'
        label={
          hasDescriptionDe ? (
            <Trans
              i18nKey='storeForm:descriptionRemainingCharactersDe'
              values={{ chars: DESCRIPTION_MAX_CHARS - acceptingStore.descriptionDe.length }}
            />
          ) : (
            <Trans i18nKey='storeForm:descriptionLabelDe' values={{ maxChars: DESCRIPTION_MAX_CHARS }} />
          )
        }
        placeholder={t('descriptionPlaceholder')}
        value={acceptingStore?.descriptionDe ?? ''}
        onChange={value => updateStore('descriptionDe', value)}
        rows={4}
        multiline
        showError={descriptionValidation(acceptingStore?.descriptionDe).invalid}
        errorMessage={descriptionValidation(acceptingStore?.descriptionDe).message}
      />
      {locales.includes('en') && (
        <CardTextField
          id='store-descriptionEn-input'
          label={
            hasDescriptionEn ? (
              <Trans
                i18nKey='storeForm:descriptionRemainingCharactersEn'
                values={{ chars: DESCRIPTION_MAX_CHARS - acceptingStore.descriptionEn.length }}
              />
            ) : (
              <Trans i18nKey='storeForm:descriptionLabelEn' values={{ maxChars: DESCRIPTION_MAX_CHARS }} />
            )
          }
          placeholder={t('descriptionPlaceholder')}
          value={acceptingStore?.descriptionEn ?? ''}
          onChange={value => updateStore('descriptionEn', value)}
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
