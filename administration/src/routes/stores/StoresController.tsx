import { Stack } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import RenderGuard from '../../components/RenderGuard'
import { Role, useSearchAcceptingStoresInProjectQuery } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import getQueryResult from '../../util/getQueryResult'
import StoresListOverview from './components/StoresListOverview'

const StoresController = (): ReactElement => {
  const { projectId: project, storesManagement } = useContext(ProjectConfigContext)

  const { t } = useTranslation('stores')
  const searchAcceptingStoresInProjectQuery = useSearchAcceptingStoresInProjectQuery({
    variables: {
      project,
      params: {},
    },
  })

  const searchAcceptingStoresInProjectQueryResult = getQueryResult(
    searchAcceptingStoresInProjectQuery,
  )

  if (!searchAcceptingStoresInProjectQueryResult.successful) {
    return searchAcceptingStoresInProjectQueryResult.component
  }
  const storeData = searchAcceptingStoresInProjectQueryResult.data.stores

  return (
    <RenderGuard
      allowedRoles={[Role.ProjectStoreManager]}
      condition={storesManagement.enabled}
      error={{
        description: storesManagement.enabled
          ? t('errors:notAuthorizedToManageStores')
          : t('errors:manageStoresNotActivated'),
      }}
    >
      <Stack sx={{ maxWidth: '95vw', m: 2, gap: 2, alignSelf: 'center' }}>
        <StoresListOverview data={storeData} />
      </Stack>
    </RenderGuard>
  )
}

export default StoresController
