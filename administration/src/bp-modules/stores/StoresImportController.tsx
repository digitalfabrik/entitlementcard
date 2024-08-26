import { NonIdealState } from '@blueprintjs/core'
import React, { ReactElement, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { WhoAmIContext } from '../../WhoAmIProvider'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { Role, useImportAcceptingStoresMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { StoreFieldConfig } from '../../project-configs/getProjectConfig'
import { useAppToaster } from '../AppToaster'
import { AcceptingStoreEntry } from './AcceptingStoreEntry'
import StoresButtonBar from './StoresButtonBar'
import StoresCSVInput from './StoresCSVInput'
import StoresTable from './StoresTable'

const StoresImportController = (): ReactElement => {
  const { role } = useContext(WhoAmIContext).me!
  const storeManagement = useContext(ProjectConfigContext).storeManagement
  if (role !== Role.ProjectStoreManager || !storeManagement.enabled) {
    return (
      <NonIdealState
        icon='cross'
        title='Fehlende Berechtigung'
        description='Sie sind nicht berechtigt, Akzeptanzpartner zu verwalten.'
      />
    )
  }

  return <StoresImport fields={storeManagement.fields} />
}

type StoreImportProps = {
  fields: StoreFieldConfig[]
}

export type StoreData = {
  [key: string]: string
}
const StoresImport = ({ fields }: StoreImportProps): ReactElement => {
  const { projectId } = useContext(ProjectConfigContext)
  const navigate = useNavigate()
  const appToaster = useAppToaster()
  const [acceptingStores, setAcceptingStores] = useState<AcceptingStoreEntry[]>([])
  const [importStores] = useImportAcceptingStoresMutation({
    onCompleted: () => {
      appToaster?.show({ intent: 'success', message: 'Ihre Akzeptanzpartner wurden importiert.' })
      setAcceptingStores([])
    },
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
  })

  const goBack = () => {
    if (!acceptingStores.length) {
      navigate('/stores')
    } else {
      setAcceptingStores([])
    }
  }

  const onImportStores = () =>
    importStores({ variables: { stores: acceptingStores.map(store => store.data), project: projectId } })

  return (
    <>
      {acceptingStores.length === 0 ? (
        <StoresCSVInput setAcceptingStores={setAcceptingStores} fields={fields} />
      ) : (
        <StoresTable fields={fields} acceptingStores={acceptingStores} />
      )}
      <StoresButtonBar goBack={goBack} acceptingStores={acceptingStores} importStores={onImportStores} />
    </>
  )
}

export default StoresImportController
