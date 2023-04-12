import { Alert, Button, Callout, Card, Divider, H4, IResizeEntry, NonIdealState, ResizeSensor } from '@blueprintjs/core'
import React, { FunctionComponent, useContext, useState } from 'react'
import FlipMove from 'react-flip-move'
import styled, { css } from 'styled-components'

import { GetApplicationsQuery, useDeleteApplicationMutation } from '../../generated/graphql'
import usePrintMode from '../../hooks/usePrintMode'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { useAppToaster } from '../AppToaster'
import JsonFieldView, { GeneralJsonField } from './JsonFieldView'
import VerificationsView, { VerificationsQuickIndicator } from './VerificationsView'

export type Application = GetApplicationsQuery['applications'][number]

export const CARD_PADDING = 20
const COLLAPSED_HEIGHT = 250

const ApplicationViewCard = styled(Card)<{ $collapsed: boolean; $contentHeight: number; $hideInPrintMode?: boolean }>`
  transition: height 0.2s;
  height: ${props => (props.$collapsed ? COLLAPSED_HEIGHT : props.$contentHeight + 2 * CARD_PADDING)}px;
  width: 600px;
  overflow: hidden;
  margin: 10px;
  padding: 0;
  position: relative;
  @media print {
    width: 100%;
    height: auto;
  }
  ${props =>
    props.$hideInPrintMode &&
    css`
      @media print {
        display: none;
      }
    `};
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

const WithdrawAlert = styled(Callout)`
  margin-bottom: 16px;
`

const PrintAwareButton = styled(Button)`
  @media print {
    display: none;
  }
`

const ApplicationView: FunctionComponent<{
  application: Application
  gotDeleted: () => void
  enablePrintMode: (applicationId: number) => void
  printApplicationId: number | null
}> = ({ application, gotDeleted, enablePrintMode, printApplicationId }) => {
  const { createdDate: createdDateString, jsonValue, id, withdrawalDate } = application
  const jsonField: GeneralJsonField = JSON.parse(jsonValue)
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${id}`
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
  const isSelectedForPrint = id === printApplicationId

  return (
    <ApplicationViewCard
      elevation={2}
      $collapsed={collapsed}
      $contentHeight={height}
      $hideInPrintMode={!isSelectedForPrint}>
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
            <H4>Antrag vom {formatDateWithTimezone(createdDateString, config.timezone)}</H4>
            <VerificationsQuickIndicator verifications={application.verifications} />
          </div>
          {withdrawalDate && (
            <WithdrawAlert intent='warning'>
              Der Antrag wurde vom Antragssteller am {formatDateWithTimezone(withdrawalDate, config.timezone)}{' '}
              zurückgezogen. <br />
              Bitte löschen Sie den Antrag zeitnah.
            </WithdrawAlert>
          )}
          <JsonFieldView
            jsonField={jsonField}
            baseUrl={baseUrl}
            key={0}
            hierarchyIndex={0}
            attachmentAccessible={!isSelectedForPrint}
          />
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
              <PrintAwareButton onClick={() => setCollapsed(true)} icon='caret-up'>
                Weniger anzeigen
              </PrintAwareButton>
            ) : null}
            <PrintAwareButton onClick={() => enablePrintMode(id)} intent='primary' icon='print'>
              PDF Export
            </PrintAwareButton>
            <PrintAwareButton onClick={() => setDeleteDialogOpen(true)} intent='danger' icon='trash'>
              Antrag löschen
            </PrintAwareButton>
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
export class ApplicationViewComponent extends React.Component<{
  application: Application
  gotDeleted: () => void
  enablePrintMode: (applicationId: number) => void
  printApplicationId: number | null
}> {
  render() {
    return <ApplicationView {...this.props} />
  }
}

const ApplicationsOverview = (props: { applications: Application[] }) => {
  const [updatedApplications, setUpdatedApplications] = useState(props.applications)
  const { printApplicationId, setPrintApplicationId } = usePrintMode()

  return (
    // @ts-ignore
    <FlipMove style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {updatedApplications.map(application => (
        <ApplicationViewComponent
          printApplicationId={printApplicationId}
          enablePrintMode={setPrintApplicationId}
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
