import { Button, Card, Divider, H4, IResizeEntry, NonIdealState, ResizeSensor } from '@blueprintjs/core'
import { format } from 'date-fns'
import React, { FunctionComponent, useContext, useState } from 'react'
import styled from 'styled-components'
import JsonFieldView, { GeneralJsonField } from './JsonFieldView'
import { useAppToaster } from '../AppToaster'
import FlipMove from 'react-flip-move'
import {
  GetApplicationsQuery,
  useDeleteApplicationMutation,
  useWithdrawApplicationMutation,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import VerificationsView, { VerificationsQuickIndicator } from './VerificationsView'
import ApplicationAction from './ApplicationAction'
import { useParams } from 'react-router-dom'

export type Application = GetApplicationsQuery['applications'][number]

const CARD_PADDING = 20
const COLLAPSED_HEIGHT = 250

const ApplicationViewCard = styled(Card)<{ $collapsed: boolean; $contentHeight: number; $centered: boolean }>`
  transition: height 0.2s;
  height: ${props => (props.$collapsed ? COLLAPSED_HEIGHT : props.$contentHeight + 2 * CARD_PADDING)}px;
  width: 600px;
  overflow: hidden;
  margin: 10px;
  padding: 0;
  position: relative;
  ${props => props.$centered && 'align-self: center;'}
`

const ExpandContainer = styled.div<{ $collapsed: boolean }>`
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 100%);
  opacity: ${props => (props.$collapsed ? '1' : '0')};
  position: absolute;
  top: 0;
  transition: opacity 0.2s;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: flex-end;
  padding: ${CARD_PADDING}px;
  pointer-events: ${props => (props.$collapsed ? 'all' : 'none')};
`

const ApplicationView: FunctionComponent<{ application: Application; gotDeleted: () => void; mode: string }> = ({
  application,
  gotDeleted,
  mode,
}) => {
  const { createdDate: createdDateString, jsonValue, id } = application
  const { accessKey } = useParams()
  const createdDate = new Date(createdDateString)
  const jsonField: GeneralJsonField = JSON.parse(jsonValue)
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/application/${config.projectId}/${id}`
  const [collapsed, setCollapsed] = useState(false)
  const [height, setHeight] = useState(0)
  const appToaster = useAppToaster()
  const [deleteApplication, { loading }] = useDeleteApplicationMutation({
    onError: error => {
      console.error(error)
      appToaster?.show({ intent: 'danger', message: 'Etwas ist schief gelaufen.' })
    },
    onCompleted: ({ deleted }: { deleted: boolean }) => {
      if (deleted) gotDeleted()
      else {
        console.error('Delete operation returned false.')
        appToaster?.show({ intent: 'danger', message: 'Etwas ist schief gelaufen.' })
      }
    },
  })

  const [withdrawApplication, { loading: withdrawalLoading }] = useWithdrawApplicationMutation()

  const submitWithdrawal = () => {
    if (accessKey) {
      withdrawApplication({
        variables: {
          accessKey: accessKey,
        },
      })
    }
  }

  const handleResize = (entries: IResizeEntry[]) => {
    setHeight(entries[0].contentRect.height)
    if (height === 0 && entries[0].contentRect.height > COLLAPSED_HEIGHT) setCollapsed(true)
  }

  // TODO use enum for mode, add error handling for withdraw && getApplicationByUserAccessKey, check withdrawal date for internal application

  return (
    <ApplicationViewCard elevation={2} $collapsed={collapsed} $contentHeight={height} $centered={mode === 'withdrawal'}>
      <ExpandContainer onClick={() => setCollapsed(false)} $collapsed={collapsed}>
        <Button icon='caret-down'>Mehr anzeigen</Button>
      </ExpandContainer>
      <ResizeSensor onResize={handleResize}>
        <div style={{ overflow: 'visible', padding: `${CARD_PADDING}px` }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            <H4>Antrag vom {format(createdDate, 'dd.MM.yyyy, HH:mm')}</H4>
            <VerificationsQuickIndicator verifications={application.verifications} />
          </div>
          <JsonFieldView jsonField={jsonField} baseUrl={baseUrl} key={0} hierarchyIndex={0} />
          <Divider style={{ margin: '24px 0px' }} />
          <VerificationsView verifications={application.verifications} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}>
            {height > COLLAPSED_HEIGHT ? (
              <Button onClick={() => setCollapsed(true)} icon='caret-up'>
                Weniger anzeigen
              </Button>
            ) : null}
            {mode === 'delete' && (
              <ApplicationAction
                confirmAction={() => deleteApplication({ variables: { applicationId: application.id } })}
                loading={loading}
                cancelButtonText='Abbrechen'
                confirmButtonText='Antrag löschen'
                buttonLabel='Antrag löschen'
                dialogText='Möchten Sie den Antrag unwiderruflich löschen?'
              />
            )}
            {mode === 'withdrawal' && (
              <ApplicationAction
                confirmAction={submitWithdrawal}
                loading={withdrawalLoading}
                cancelButtonText='Abbrechen'
                confirmButtonText='Antrag zurückziehen'
                buttonLabel='Antrag zurückziehen'
                dialogText='Möchten Sie den Antrag zurückziehen?'
              />
            )}
          </div>
        </div>
      </ResizeSensor>
    </ApplicationViewCard>
  )
}

// Necessary for FlipMove, as it cannot handle functional components
export class ApplicationViewComponent extends React.Component<{
  application: Application
  gotDeleted: () => void
  mode: string
}> {
  render() {
    return <ApplicationView {...this.props} />
  }
}

const ApplicationsOverview = (props: { applications: Application[] }) => {
  const [updatedApplications, setUpdatedApplications] = useState(props.applications)

  return (
    // @ts-ignore
    <FlipMove style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {updatedApplications.map(application => (
        <ApplicationViewComponent
          mode={'delete'}
          key={application.id}
          application={application}
          gotDeleted={() => setUpdatedApplications(updatedApplications.filter(a => a !== application))}
        />
      ))}
      {updatedApplications.length === 0 ? (
        <NonIdealState
          title='Keine Anträge vorhanden'
          icon='clean'
          description='Aktuell liegen keine eingehenden Anträge vor. Schauen Sie später wieder vorbei.'
        />
      ) : null}
    </FlipMove>
  )
}

export default ApplicationsOverview
