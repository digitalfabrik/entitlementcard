import { AddCircleOutlineOutlined, ArrowCircleUp } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { useWhoAmI } from '../../WhoAmIProvider'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { FREINET_PARAM } from '../constants'

const CreateCardsController = (): ReactElement => {
  const { region } = useWhoAmI().me
  const { freinetCSVImportEnabled } = useContext(ProjectConfigContext)
  const { t } = useTranslation('cards')

  return (
    <RenderGuard
      allowedRoles={[Role.RegionManager, Role.RegionAdmin]}
      condition={region !== undefined}
      error={{ description: t('errors:notAuthorizedToCreateCards') }}>
      <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'safe center', overflowY: 'auto' }}>
        <Stack sx={{ width: '400px', padding: 2, gap: 2 }}>
          <Button
            href='./add'
            size='large'
            startIcon={<AddCircleOutlineOutlined />}
            variant='outlined'
            sx={{ flexDirection: 'column', gap: 1, py: 2 }}>
            {t('createSingleCards')}
          </Button>
          <Button
            href='./import'
            size='large'
            startIcon={<ArrowCircleUp />}
            variant='outlined'
            sx={{ flexDirection: 'column', gap: 1, py: 2 }}>
            {t('importMultipleCards')}
          </Button>
          {freinetCSVImportEnabled && (
            <Button
              href={`./import?${FREINET_PARAM}=true`}
              size='large'
              startIcon={<ArrowCircleUp />}
              variant='outlined'
              sx={{ flexDirection: 'column', gap: 1, py: 2 }}>
              {t('importCardsFromFreinet')}
            </Button>
          )}
        </Stack>
      </Stack>
    </RenderGuard>
  )
}

export default CreateCardsController
