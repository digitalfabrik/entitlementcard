import { Alert, Button, Card, Divider, H4, IResizeEntry, NonIdealState, ResizeSensor } from '@blueprintjs/core'
import { format } from 'date-fns'
import React, { FunctionComponent, useContext, useState } from 'react'
import styled from 'styled-components'
import JsonFieldView, { GeneralJsonField } from './JsonFieldView'
import { useAppToaster } from '../AppToaster'
import FlipMove from 'react-flip-move'
import { GetApplicationsQuery, useDeleteApplicationMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import VerificationsView, { VerificationsQuickIndicator } from './VerificationsView'

type Application = GetApplicationsQuery['applications'][number]

export const CARD_PADDING = 20
const COLLAPSED_HEIGHT = 250

const ApplicationViewCard = styled(Card)<{ $collapsed: boolean; $contentHeight: number }>`
  transition: height 0.2s;
  height: ${props => (props.$collapsed ? COLLAPSED_HEIGHT : props.$contentHeight + 2 * CARD_PADDING)}px;
  width: 600px;
  overflow: hidden;
  margin: 10px;
  padding: 0;
  position: relative;
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

const ApplicationView: FunctionComponent<{ application: Application; gotDeleted: () => void }> = ({
  application,
  gotDeleted,
}) => {
  const { createdDate: createdDateString, jsonValue, id } = application
  const createdDate = new Date(createdDateString)
  const jsonField: GeneralJsonField = JSON.parse(jsonValue)
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${process.env.REACT_APP_API_BASE_URL}/application/${config.projectId}/${id}`
  const [collapsed, setCollapsed] = useState(false)
  const [height, setHeight] = useState(0)
  const appToaster = useAppToaster()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
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

  const handleResize = (entries: IResizeEntry[]) => {
    setHeight(entries[0].contentRect.height)
    if (height === 0 && entries[0].contentRect.height > COLLAPSED_HEIGHT) setCollapsed(true)
  }

  return (
    <ApplicationViewCard elevation={2} $collapsed={collapsed} $contentHeight={height}>
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
            <Button onClick={() => setDeleteDialogOpen(true)} intent='danger' icon='trash'>
              Antrag löschen
            </Button>
            <Alert
              cancelButtonText='Abbrechen'
              confirmButtonText='Antrag löschen'
              icon='trash'
              intent='danger'
              isOpen={deleteDialogOpen}
              loading={loading}
              onCancel={() => setDeleteDialogOpen(false)}
              onConfirm={() => deleteApplication({ variables: { applicationId: application.id } })}>
              <p>Möchten Sie den Antrag unwiderruflich löschen?</p>
            </Alert>
          </div>
        </div>
      </ResizeSensor>
    </ApplicationViewCard>
  )
}

// Necessary for FlipMove, as it cannot handle functional components
class ApplicationViewComponent extends React.Component<{ application: Application; gotDeleted: () => void }> {
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
