/* eslint-disable react/destructuring-assignment */
import { MutationResult } from '@apollo/client'
import { Colors, H4, Icon, Section } from '@blueprintjs/core'
import { CreditScore, Delete, Print } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material'
import React, { ReactElement, memo, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useDeleteApplicationMutation } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { useAppToaster } from '../AppToaster'
import type { Application } from './ApplicationsOverview'
import type { JsonField } from './JsonFieldView'
import JsonFieldView, { findValue } from './JsonFieldView'
import NoteDialogController from './NoteDialogController'
import { getPreVerifiedEntitlementType } from './PreVerifiedEntitlementType'
import PreVerifiedQuickIndicator from './PreVerifiedQuickIndicator'
import VerificationsQuickIndicator from './VerificationsQuickIndicator'
import VerificationsView from './VerificationsView'
import { printAwareCss } from './constants'

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

const PrintAwarePrimaryButton = styled(Button)`
  margin-right: 10px;
  ${printAwareCss};
  // TODO: Remove this style after blueprint.js is completely removed
  &:hover {
    color: white;
  }
`

const PrintAwareButton = styled(Button)`
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

const RightElementContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
`

const Spacer = styled.div`
  flex-grow: 1;
`

type RightElementProps = {
  jsonField: JsonField<'Array'>
  application: Application
}

const RightElement = ({ jsonField, application }: RightElementProps): ReactElement => {
  const applicationDetails = findValue(jsonField, 'applicationDetails', 'Array') ?? jsonField
  const preVerifiedEntitlementType = getPreVerifiedEntitlementType(applicationDetails)

  return (
    <RightElementContainer>
      {!!application.note && application.note.trim() && <Icon icon='annotation' intent='none' />}
      {preVerifiedEntitlementType !== undefined ? (
        <PreVerifiedQuickIndicator type={preVerifiedEntitlementType} />
      ) : (
        <VerificationsQuickIndicator verifications={application.verifications} />
      )}
    </RightElementContainer>
  )
}

const DeleteDialog = (p: {
  isOpen: boolean
  deleteResult: MutationResult
  onConfirm: () => void
  onCancel: () => void
}) => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <Dialog open={p.isOpen} aria-describedby='alert-dialog-description'>
      <DialogContent id='alert-dialog-description'>
        <Stack direction='row' gap={2} alignItems='center'>
          {p.deleteResult.loading || p.deleteResult.called ? (
            <CircularProgress size={64} />
          ) : (
            <Delete sx={{ fontSize: '64px' }} color='error' />
          )}
          {t('deleteApplicationConfirmationPrompt')}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={p.deleteResult.loading || p.deleteResult.called} onClick={p.onCancel}>
          {t('misc:cancel')}
        </Button>
        <Button color='error' disabled={p.deleteResult.loading || p.deleteResult.called} onClick={p.onConfirm}>
          {t('deleteApplication')}
        </Button>
      </DialogActions>
    </Dialog>
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
  onChange,
}: ApplicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation('applicationsOverview')
  const theme = useTheme()
  const { createdDate: createdDateString, jsonValue, id, withdrawalDate, cardCreated } = application
  const jsonField: JsonField<'Array'> = JSON.parse(jsonValue)
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${id}`
  const appToaster = useAppToaster()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [openNoteDialog, setOpenNoteDialog] = useState(false)
  const [deleteApplication, deleteResult] = useDeleteApplicationMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: ({ deleted }: { deleted: boolean }) => {
      if (deleted) {
        onDelete()
      } else {
        console.error('Delete operation returned false.')
        appToaster?.show({ intent: 'danger', message: t('errors:unknown') })
      }
    },
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
          <Title>
            {t('applicationFrom')} {formatDateWithTimezone(createdDateString, config.timezone)}&emsp;
          </Title>{' '}
          {personalData && personalData.forenames !== undefined && personalData.surname !== undefined && (
            <CardContentHint>
              {t('name')}: {personalData.surname}, {personalData.forenames}
            </CardContentHint>
          )}
        </div>
      }
      rightElement={<RightElement jsonField={jsonField} application={application} />}
      elevation={1}
      icon={withdrawalDate ? <Icon icon='warning-sign' intent='warning' /> : undefined}
      collapseProps={{ isOpen: isExpanded, onToggle: () => setIsExpanded(!isExpanded), keepChildrenMounted: true }}
      collapsible={!isSelectedForPrint}
      $hideInPrintMode={!isSelectedForPrint}>
      <Stack sx={{ p: 2 }} gap={2}>
        <Stack direction='row' spacing={2} alignItems='flex-start'>
          {withdrawalDate ? (
            <Box sx={{ bgcolor: theme.palette.warning.light, p: 2, flexGrow: 1 }}>
              {t('withdrawalMessage', { withdrawalDate: formatDateWithTimezone(withdrawalDate, config.timezone) })}
              <br />
              {t('deleteApplicationSoonPrompt')}
            </Box>
          ) : (
            <Spacer />
          )}
          <NoteDialogController
            application={application}
            isOpen={openNoteDialog}
            onOpenNoteDialog={setOpenNoteDialog}
            onChange={onChange}
          />
        </Stack>

        {/* TODO: <JsonFieldView> does not emit a root element and thus, <Stack> would insert a gap here */}
        <div>
          <JsonFieldView
            jsonField={jsonField}
            baseUrl={baseUrl}
            key={0}
            hierarchyIndex={0}
            attachmentAccessible
            expandedRoot={false}
          />
        </div>
      </Stack>

      <Divider />

      <Box sx={{ p: 2 }}>
        <VerificationsView verifications={application.verifications} />
      </Box>

      <Divider />

      <Stack sx={{ p: 2 }} spacing={2} direction='row'>
        <Tooltip title={createCardQuery ? undefined : t('incompleteMappingTooltip')}>
          {/* Make the outer Tooltip independent of the button's disabled state */}
          <span>
            <PrintAwarePrimaryButton
              disabled={!createCardQuery}
              variant='contained'
              color='primary'
              href={createCardQuery ? `./cards/add${createCardQuery}` : undefined}
              startIcon={<CreditScore />}>
              {cardCreated ? t('createCardAgain') : t('createCard')}
            </PrintAwarePrimaryButton>
          </span>
        </Tooltip>
        <PrintAwareButton
          onClick={() => setDeleteDialogOpen(true)}
          startIcon={<Delete />}
          variant='outlined'
          color='error'>
          {t('deleteApplication')}
        </PrintAwareButton>
        <PrintAwareButton
          onClick={() => printApplicationById(id)}
          startIcon={<Print />}
          variant='outlined'
          color='inherit'>
          {t('exportPdf')}
        </PrintAwareButton>
        <CollapseIcon icon='chevron-up' onClick={() => setIsExpanded(!isExpanded)} style={{ marginLeft: 'auto' }} />
      </Stack>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        deleteResult={deleteResult}
        onConfirm={() => deleteApplication({ variables: { applicationId: application.id } })}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </ApplicationViewCard>
  )
}

export default memo(ApplicationCard)
