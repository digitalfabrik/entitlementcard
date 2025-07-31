import { Button, Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { CsvIcon } from '../../components/icons/CsvIcon'
import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const StoresController = (): ReactElement => {
  const navigate = useNavigate()
  const storesManagement = useContext(ProjectConfigContext).storesManagement
  const { t } = useTranslation('stores')

  return (
    <RenderGuard
      allowedRoles={[Role.ProjectStoreManager]}
      condition={storesManagement.enabled}
      error={{
        description: storesManagement.enabled
          ? t('errors:notAuthorizedToManageStores')
          : t('errors:manageStoresNotActivated'),
      }}>
      <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'safe center' }}>
        <Button
          color='default'
          size='large'
          variant='contained'
          startIcon={<CsvIcon />}
          onClick={() => navigate('./import')}>
          {t('storesCsvImport')}
        </Button>
      </Stack>
    </RenderGuard>
  )
}

export default StoresController
