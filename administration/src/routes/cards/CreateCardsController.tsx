import { AddCard, UploadFile } from '@mui/icons-material'
import { Button, Stack, SxProps } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import RenderGuard from '../../components/RenderGuard'
import { Role } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useWhoAmI } from '../../provider/WhoAmIProvider'
import { FREINET_PARAM } from './constants'

const buttonStyle: SxProps = {
  flexDirection: 'column',
  gap: 1,
  py: 2,
}

const CreateCardsController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { freinetCSVImportEnabled } = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')

  return (
    <RenderGuard
      allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('errors:notAuthorizedToCreateCards') }}
    >
      <Stack
        sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'safe center', overflowY: 'auto' }}
      >
        <Stack sx={{ width: '400px', padding: 2, gap: 2 }}>
          <Button sx={buttonStyle} startIcon={<AddCard />} size='large' href='./add'>
            {t('createSingleCards')}
          </Button>
          <Button sx={buttonStyle} startIcon={<UploadFile />} size='large' href='./import'>
            {t('importMultipleCards')}
          </Button>
          {freinetCSVImportEnabled && (
            <Button
              sx={buttonStyle}
              startIcon={<UploadFile />}
              size='large'
              href={`./import?${FREINET_PARAM}=true`}
            >
              {t('importCardsFromFreinet')}
            </Button>
          )}
        </Stack>
      </Stack>
    </RenderGuard>
  )
}

export default CreateCardsController
