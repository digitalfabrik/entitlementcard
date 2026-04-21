import { Stack } from '@mui/material'
import { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'urql'

import RenderGuard from '../../components/RenderGuard'
import { Role, SearchAcceptingStoresInProjectDocument } from '../../graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import getQueryResult from '../../util/getQueryResult'
import StoresListOverview from './components/StoresListOverview'

const StoresController = (): ReactElement => {
  const { projectId: project, storesManagement } = useContext(ProjectConfigContext)
  const { t } = useTranslation('stores')
  const [searchAcceptingStoresState, searchAcceptingStoresQuery] = useQuery({
    query: SearchAcceptingStoresInProjectDocument,
    variables: {
      project,
      params: {
        categoryIds: null,
        coordinates: null,
        limit: null,
        offset: undefined,
        searchText: null,
      },
    },
  })

  const searchAcceptingStoresInProjectQueryResult = getQueryResult(
    searchAcceptingStoresState,
    searchAcceptingStoresQuery,
  )

  if (!searchAcceptingStoresInProjectQueryResult.successful) {
    return searchAcceptingStoresInProjectQueryResult.component
  }
  const storeData = searchAcceptingStoresInProjectQueryResult.data.stores

  const refetchStores = () => {
    searchAcceptingStoresQuery({ requestPolicy: 'network-only' })
  }

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
        <StoresListOverview data={storeData} refetchStores={refetchStores} />
      </Stack>
    </RenderGuard>
  )
}

export default StoresController
