import {
  Alert,
  AnchorButton,
  Button,
  Callout,
  Colors,
  H4,
  Icon,
  Section,
  SectionCard,
  Tooltip
} from '@blueprintjs/core'
import React, { ReactElement, memo, useContext, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useDeleteApplicationMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { useAppToaster } from '../AppToaster'
import { Application } from './ApplicationsOverview'
import JsonFieldView, { JsonField, findValue } from './JsonFieldView'
import NoteDialogController from './NoteDialogController'
import VerificationsQuickIndicator from './VerificationsQuickIndicator'
import VerificationsView from './VerificationsView'
import PreVerifiedQuickIndicator, { PreVerifiedQuickIndicatorType } from './PreVerifiedQuickIndicator'

export const printAwareCss = css`
  @media print {
    display: none;
  }
`

const ApplicationViewCard = styled(Section)<{ $hideInPrintMode?: boolean }>`
  width: 1000px;
  max-width: 90%;
  overflow: hidden;
  margin: 10px;
  position: relative;
  @media print {
    width: 100%;
    height: auto;
    box-shadow: none;
  }
  ${props => props.$hideInPrintMode && printAwareCss};
`

const ButtonContainer = styled.div`
  display: flex;
  flex-grow: 1;
  margin-top: 10px;
`

export const CollapseIcon = styled(Icon)`
  display: block;
  margin-left: auto;
  align-self: center;
  padding: 2px;
  ${printAwareCss};

  :hover {
    cursor: pointer;
    color: ${Colors.GRAY1};
  }
`

const WithdrawAlert = styled(Callout)`
  margin-bottom: 16px;
`

const PrintAwareButton = styled(Button)`
  margin-right: 10px;
  ${printAwareCss};
`

const PrintAwareAnchorButton = styled(AnchorButton)`
  margin-right: 10px;
  ${printAwareCss};
`

const Title = styled(H4)`
  margin: 0;
  display: inline-block;
`

const CardContentHint = styled(Title)`
  color: ${Colors.GRAY1};
`

const SectionCardHeader = styled.div`
  display: flex;
  gap: 20px;
  align-items: baseline;
  flex-direction: row-reverse;
`

const RightElementContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
`

type RightElementProps = {
  jsonField: JsonField<'Array'>
  application: Application
}

const RightElement = ({ jsonField, application }: RightElementProps): ReactElement => {
  const isJuleicaEntitlementType = (): boolean => {
    const applicationDetails = findValue(jsonField, 'applicationDetails', 'Array') ?? jsonField
    const blueCardJuleicaEntitlement = findValue(applicationDetails, 'blueCardJuleicaEntitlement', 'Array')
    return !!blueCardJuleicaEntitlement
  }

  const isPreverified = (): boolean => {
    const applicationDetails = findValue(jsonField, 'applicationDetails', 'Array') ?? jsonField;
    const workAtOrganizationsEntitlement = findValue(applicationDetails, 'blueCardWorkAtOrganizationsEntitlement', 'Array')?.value ?? [];

    const isAlreadyVerified = workAtOrganizationsEntitlement.some((entitlement: any) =>
      entitlement.value.some((organization: any) =>
        organization.name === 'isAlreadyVerified' && organization.value === true
      )
    )
    return isAlreadyVerified
  }

  let quickIndicator;
  if (isJuleicaEntitlementType()) {
    quickIndicator = <PreVerifiedQuickIndicator type={PreVerifiedQuickIndicatorType.Juleica} />;
  } else if (isPreverified()) {
    quickIndicator = <PreVerifiedQuickIndicator type={PreVerifiedQuickIndicatorType.Verein360} />;
  } else {
    quickIndicator = <VerificationsQuickIndicator verifications={application.verifications} />;
  }

  return (
    <RightElementContainer>
      {!!application.note && application.note.trim() && <Icon icon="annotation" intent="none" />}
      {quickIndicator}
    </RightElementContainer>
  )
}

export type ApplicationCardProps = {
  application: Application
  onDelete: () => void
  printApplicationById: (applicationId: number) => void
  isSelectedForPrint: boolean
  onChange: (application: Application) => void
}

const ApplicationCard = ({
                           application,
                           onDelete,
                           printApplicationById,
                           isSelectedForPrint,
                           onChange
                         }: ApplicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { createdDate: createdDateString, jsonValue, id, withdrawalDate, cardCreated } = application
  const jsonField: JsonField<'Array'> = JSON.parse(jsonValue)
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${id}`
  const appToaster = useAppToaster()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [openNoteDialog, setOpenNoteDialog] = useState(false)
  const [deleteApplication, { loading }] = useDeleteApplicationMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: ({ deleted }: { deleted: boolean }) => {
      if (deleted) {
        onDelete()
      } else {
        console.error('Delete operation returned false.')
        appToaster?.show({ intent: 'danger', message: 'Etwas ist schief gelaufen.' })
      }
    }
  })

  const createCardQuery = useMemo(
    () => `${config.applicationFeature?.applicationJsonToCardQuery(jsonField)}&applicationIdToMarkAsProcessed=${id}`,
    [config.applicationFeature, jsonField, id]
  )

  const personalData = useMemo(
    () => config.applicationFeature?.applicationJsonToPersonalData(jsonField),
    [config.applicationFeature, jsonField]
  )

  return (
    <ApplicationViewCard
      title={
        <div>
          <Title>Antrag vom {formatDateWithTimezone(createdDateString, config.timezone)}&emsp;</Title>{' '}
          {personalData && personalData.forenames !== undefined && personalData.surname !== undefined && (
            <CardContentHint>
              Name: {personalData.surname}, {personalData.forenames}
            </CardContentHint>
          )}
        </div>
      }
      rightElement={<RightElement jsonField={jsonField} application={application} />}
      elevation={1}
      icon={withdrawalDate ? <Icon icon="warning-sign" intent="warning" /> : undefined}
      collapseProps={{ isOpen: isExpanded, onToggle: () => setIsExpanded(!isExpanded), keepChildrenMounted: true }}
      collapsible={!isSelectedForPrint}
      $hideInPrintMode={!isSelectedForPrint}>
      <SectionCard>
        <SectionCardHeader>
          <NoteDialogController
            application={application}
            isOpen={openNoteDialog}
            onOpenNoteDialog={setOpenNoteDialog}
            onChange={onChange}
          />

          {!!withdrawalDate && (
            <WithdrawAlert intent="warning">
              Der Antrag wurde vom Antragsteller am {formatDateWithTimezone(withdrawalDate, config.timezone)}{' '}
              zurückgezogen. <br />
              Bitte löschen Sie den Antrag zeitnah.
            </WithdrawAlert>
          )}
        </SectionCardHeader>
        <JsonFieldView
          jsonField={jsonField}
          baseUrl={baseUrl}
          key={0}
          hierarchyIndex={0}
          attachmentAccessible
          expandedRoot={false}
        />
      </SectionCard>
      <SectionCard>
        <VerificationsView verifications={application.verifications} />
      </SectionCard>
      <SectionCard>
        <ButtonContainer>
          <Tooltip
            disabled={!!createCardQuery}
            content="Es existiert kein passendes Mapping, um aus diesem Antrag das Kartenformular vollständig auszufüllen.">
            <PrintAwareAnchorButton
              disabled={!createCardQuery}
              href={createCardQuery ? `./cards/add${createCardQuery}` : undefined}
              icon="id-number"
              intent="primary">
              {cardCreated ? 'Karte erneut erstellen' : 'Karte erstellen'}
            </PrintAwareAnchorButton>
          </Tooltip>
          <PrintAwareButton onClick={() => setDeleteDialogOpen(true)} intent="danger" icon="trash">
            Antrag löschen
          </PrintAwareButton>
          <PrintAwareButton onClick={() => printApplicationById(id)} intent="none" icon="print">
            PDF exportieren
          </PrintAwareButton>
          <CollapseIcon icon="chevron-up" onClick={() => setIsExpanded(!isExpanded)} style={{ marginLeft: 'auto' }} />
        </ButtonContainer>
        <Alert
          cancelButtonText="Abbrechen"
          confirmButtonText="Antrag löschen"
          icon="trash"
          intent="danger"
          isOpen={deleteDialogOpen}
          loading={loading}
          onCancel={() => setDeleteDialogOpen(false)}
          onConfirm={() => deleteApplication({ variables: { applicationId: application.id } })}>
          <p>Möchten Sie den Antrag unwiderruflich löschen?</p>
        </Alert>
      </SectionCard>
    </ApplicationViewCard>
  )
}

export default memo(ApplicationCard)
