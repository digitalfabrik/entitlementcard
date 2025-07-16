import { Clear } from '@mui/icons-material'
import { Button, Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { useWhoAmI } from '../../WhoAmIProvider'
import { CsvIcon } from '../../components/icons/CsvIcon'
import { Role } from '../../generated/graphql'
import NonIdealState from '../../mui-modules/NonIdealState'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const StoresController = (): ReactElement => {
  const navigate = useNavigate()
  const { role } = useWhoAmI().me
  const storesManagement = useContext(ProjectConfigContext).storesManagement
  const { t } = useTranslation('stores')

  if (role !== Role.ProjectStoreManager || !storesManagement.enabled) {
    return (
      <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <NonIdealState
          icon={<Clear sx={{ fontSize: '3em' }} />}
          title={t('errors:notAuthorized')}
          description={
            storesManagement.enabled ? t('errors:notAuthorizedToManageStores') : t('errors:manageStoresNotActivated')
          }
        />
      </Stack>
    )
  }
  return (
    <Stack sx={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        color='default'
        size='large'
        variant='contained'
        startIcon={<CsvIcon />}
        onClick={() => navigate('./import')}>
        {t('storesCsvImport')}
      </Button>
    </Stack>
  )
}

export default StoresController
