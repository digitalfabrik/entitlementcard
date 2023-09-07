import { Alert, Button, Callout, Card, Divider, H4, NonIdealState, ResizeSensor } from '@blueprintjs/core'
import React, { FunctionComponent, useContext, useMemo, useState } from 'react'
import FlipMove from 'react-flip-move'
import styled, { css } from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { GetApplicationsQuery, useDeleteApplicationMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { useAppToaster } from '../AppToaster'
import JsonFieldView, { GeneralJsonField } from './JsonFieldView'
import VerificationsView, { VerificationStatus, VerificationsQuickIndicator, getStatus } from './VerificationsView'
import usePrintApplication from './hooks/usePrintApplication'

export type Application = GetApplicationsQuery['applications'][number]

enum ApplicationStatus {
  fullyVerified,
  fullyRejected,
  ambiguous,
}

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
    box-shadow: none;
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
  printApplicationById: (applicationId: number) => void
  isSelectedForPrint: boolean
}> = ({ application, gotDeleted, printApplicationById, isSelectedForPrint }) => {
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
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: ({ deleted }: { deleted: boolean }) => {
      if (deleted) gotDeleted()
      else {
        console.error('Delete operation returned false.')
        appToaster?.show({ intent: 'danger', message: 'Etwas ist schief gelaufen.' })
      }
    },
  })

  const handleResize = (entries: ResizeObserverEntry[]) => {
    setHeight(entries[0].contentRect.height)
    if (height === 0 && entries[0].contentRect.height > COLLAPSED_HEIGHT) setCollapsed(true)
  }

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
          <JsonFieldView jsonField={jsonField} baseUrl={baseUrl} key={0} hierarchyIndex={0} attachmentAccessible />
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
            <PrintAwareButton onClick={() => printApplicationById(id)} intent='primary' icon='print'>
              PDF exportieren
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
  printApplicationById: (applicationId: number) => void
  isSelectedForPrint: boolean
}> {
  render() {
    return <ApplicationView {...this.props} />
  }
}

const sortByStatus = (a: number, b: number): number => a - b
const sortByDateAsc = (a: Date, b: Date): number => a.getTime() - b.getTime()
const getApplicationStatus = (status: number[]): ApplicationStatus => {
  if (status.every(val => val === VerificationStatus.Verified)) return ApplicationStatus.fullyVerified
  if (status.every(val => val === VerificationStatus.Rejected)) return ApplicationStatus.fullyRejected
  return ApplicationStatus.ambiguous
}

// Applications will be sorted by unique status which means fully verified/rejected and within this status by creation date asc
const sortApplications = (applications: Application[]): Application[] =>
  applications
    .map(application => ({
      ...application,
      status: getApplicationStatus(application.verifications.map(getStatus)),
    }))
    .sort((a, b) => sortByStatus(a.status, b.status) || sortByDateAsc(new Date(a.createdDate), new Date(b.createdDate)))

const ApplicationsOverview = (props: { applications: Application[] }) => {
  const [updatedApplications, setUpdatedApplications] = useState(props.applications)
  const { applicationIdForPrint, printApplicationById } = usePrintApplication()
  const sortedApplications = useMemo(() => sortApplications(updatedApplications), [updatedApplications])

  return (
    <FlipMove style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
      {sortedApplications.map(application => (
        <ApplicationViewComponent
          isSelectedForPrint={application.id === applicationIdForPrint}
          printApplicationById={printApplicationById}
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
