import { ButtonGroup } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { Role } from '../../generated/graphql'
import RenderGuard from '../../mui-modules/components/RenderGuard'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import StandaloneCenter from '../StandaloneCenter'
import CardFormButton from '../cards/CardFormButton'

const Buttons = styled(ButtonGroup)`
  width: 400px;
`

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
      <StandaloneCenter>
        <Buttons vertical>
          <CardFormButton text={t('storesCsvImport')} icon='upload' onClick={() => navigate('./import')} />
        </Buttons>
      </StandaloneCenter>
    </RenderGuard>
  )
}

export default StoresController
