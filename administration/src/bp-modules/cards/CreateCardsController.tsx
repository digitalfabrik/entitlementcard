import { NonIdealState } from '@blueprintjs/core'
import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { FREINET_PARAM } from '../constants'
import CardFormButton from './CardFormButton'

const CreateCardsController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { freinetCSVImportEnabled } = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')

  const navigate = useNavigate()
  if (!region) {
    return (
      <NonIdealState
        icon='cross'
        title={t('errors:notAuthorized')}
        description={t('errors:notAuthorizedToCreateCards')}
      />
    )
  }

  return (
    <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'safe center', overflowY: 'auto' }}>
      <Stack sx={{ width: '400px', padding: 2, gap: 2 }}>
        <CardFormButton text={t('createSingleCards')} icon='add' onClick={() => navigate('./add')} />
        <CardFormButton text={t('importMultipleCards')} icon='upload' onClick={() => navigate('./import')} />
        {freinetCSVImportEnabled && (
          <CardFormButton
            text={t('importCardsFromFreinet')}
            icon='upload'
            onClick={() => navigate(`./import?${FREINET_PARAM}=true`)}
          />
        )}
      </Stack>
    </Stack>
  )
}

export default CreateCardsController
