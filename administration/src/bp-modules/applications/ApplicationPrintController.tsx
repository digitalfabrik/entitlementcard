/* eslint-disable react/destructuring-assignment */
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { GetApplicationByIdQuery, useGetApplicationByIdQuery } from '../../generated/graphql'
import getQueryResult from '../../mui-modules/util/getQueryResult'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ApplicationParsedJsonValue, parseApplication } from '../../shared/application'
import JsonFieldView from '../../shared/components/JsonFieldView'
import VerificationsView from '../../shared/components/VerificationsView'
import getApiBaseUrl from '../../util/getApiBaseUrl'

const ApplicationPrintView = (p: {
  application: ApplicationParsedJsonValue<GetApplicationByIdQuery['application']>
}): ReactElement => {
  const config = useContext(ProjectConfigContext)
  const navigate = useNavigate()
  const [printed, setPrinted] = useState(false)

  const onBeforePrint = () => {
    setPrinted(true)
    console.log(`onBefore ${printed}`)
  }
  const onAfterPrint = () => {
    // setPrinted(false)
    console.log(`onAfter ${printed}`)
  }

  useEffect(() => {
    window.addEventListener('beforeprint', onBeforePrint)
    window.addEventListener('afterprint', onAfterPrint)

    window.print()
    navigate(-1)

    return () => {
      window.addEventListener('beforeprint', onBeforePrint)
      window.addEventListener('afterprint', onAfterPrint)
    }
  }, [])

  return (
    <div>
      ApplicationPrintView
      <JsonFieldView
        jsonField={p.application.jsonValue}
        baseUrl={`${getApiBaseUrl()}/application/${config.projectId}/${p.application.id}`}
        key={0}
        hierarchyIndex={0}
        attachmentAccessible
        expandedRoot={false}
      />
      <VerificationsView application={p.application} isAdminView />
    </div>
  )
}

export const ApplicationPrintController = (p: { id: number }): ReactElement => {
  const applicationsQuery = useGetApplicationByIdQuery({
    variables: { id: p.id },
    onError: error => console.error(error),
  })
  const applicationsQueryResult = getQueryResult(applicationsQuery)

  return !applicationsQueryResult.successful ? (
    applicationsQueryResult.component
  ) : (
    <ApplicationPrintView application={parseApplication(applicationsQueryResult.data.application)} />
  )
}
