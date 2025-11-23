import { Stack } from '@mui/material'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Role, useSearchAcceptingStoresInProjectQuery } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StoresListOverview from './StoresListOverview'

const StoresController = (): ReactElement => {
  const { projectId: project, storesManagement } = useContext(ProjectConfigContext)

  const { t } = useTranslation('stores')
  const searchAcceptingStoresInProjectQuery = useSearchAcceptingStoresInProjectQuery({
    variables: {
      project,
      params: {},
    },
  })

  const searchAcceptingStoresInProjectQueryResult = getQueryResult(searchAcceptingStoresInProjectQuery)

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
      }}>
      <Stack sx={{ maxWidth: '95vw', m: 2, gap: 2, alignSelf: 'center' }}>
        <StoresListOverview data={storeData} />
      </Stack>
    </RenderGuard>
  )
}

export default StoresController
