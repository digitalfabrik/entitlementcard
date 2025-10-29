import { AddCard, UploadFile } from '@mui/icons-material'
import { Button, Stack, SxProps } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { FREINET_PARAM } from '../constants'

const buttonStyle: SxProps = {
  p: 4,
}

const CreateCardsController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { freinetCSVImportEnabled } = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')

  const navigate = useNavigate()

  return (
    <RenderGuard
      allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('errors:notAuthorizedToCreateCards') }}>
      <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'safe center', overflowY: 'auto' }}>
        <Stack sx={{ width: '400px', padding: 2, gap: 2 }}>
          <Button sx={buttonStyle} startIcon={<AddCard />} size='large' onClick={() => navigate('./add')}>
            {t('createSingleCards')}
          </Button>
          <Button sx={buttonStyle} startIcon={<UploadFile />} size='large' onClick={() => navigate('./import')}>
            {t('importMultipleCards')}
          </Button>
          {freinetCSVImportEnabled && (
            <Button
              sx={buttonStyle}
              startIcon={<UploadFile />}
              size='large'
              onClick={() => navigate(`./import?${FREINET_PARAM}=true`)}>
              {t('importMultipleCards')}
            </Button>
          )}
        </Stack>
      </Stack>
    </RenderGuard>
  )
}

export default CreateCardsController
