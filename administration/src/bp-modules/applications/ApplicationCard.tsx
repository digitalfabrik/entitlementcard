/* eslint-disable react/destructuring-assignment */
import { MutationResult } from '@apollo/client'
import { CreditScore, Delete, EditNote, ExpandMore, InfoOutline, Print, Warning } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import React, { memo, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApplicationStatus,
  useApproveApplicationStatusMutation,
  useDeleteApplicationMutation,
} from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { useAppToaster } from '../AppToaster'
import type { JsonField } from './JsonFieldView'
import JsonFieldView, { findValue } from './JsonFieldView'
import NoteDialogController from './NoteDialogController'
import { getPreVerifiedEntitlementType } from './PreVerifiedEntitlementType'
import PreVerifiedQuickIndicator from './PreVerifiedQuickIndicator'
import VerificationsQuickIndicator from './VerificationsQuickIndicator'
import VerificationsView from './VerificationsView'
import { GetApplicationsType } from './types'

const PrimaryButton = styled(Button, { name: 'contained' })<ButtonProps>`
  color: 'primary';
`

const Spacer = styled('div')`
  flex-grow: 1;
`

const ApplicationIndicators = ({
  application,
  applicationJsonData,
}: {
  application: GetApplicationsType
  applicationJsonData: JsonField<'Array'>
}) => {
  const preVerifiedEntitlementType = getPreVerifiedEntitlementType(
    findValue(applicationJsonData, 'applicationDetails', 'Array') ?? applicationJsonData
  )

  return (
    <Stack direction='row' spacing={2} sx={{ displayPrint: 'none' }}>
      {(application.note ?? '').trim().length > 0 && <EditNote />}
      {preVerifiedEntitlementType !== undefined ? (
        <PreVerifiedQuickIndicator type={preVerifiedEntitlementType} />
      ) : (
        <VerificationsQuickIndicator verifications={application.verifications} />
      )}
    </Stack>
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
        <Stack direction='row' sx={{ gap: 2, alignItems: 'center' }}>
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

const AccordionExpandButton = (p: { expanded: boolean }) => {
  const { t } = useTranslation('shared')

  return (
    <Stack sx={{ displayPrint: 'none' }}>
      <Divider />
      <Stack direction='row' sx={{ p: 1, alignItems: 'center' }}>
        <ExpandMore
          sx={{
            transform: 'rotate(0deg)',
            transition: 'transform 0.3s',
            'button[aria-expanded=true] &': {
              transform: 'rotate(180deg)',
            },
          }}
        />
        &ensp;
        {t(p.expanded ? 'accordionShowLess' : 'accordionShowMore')}
      </Stack>
    </Stack>
  )
}

const ButtonsCardPending = ({
  disabled,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}: {
  disabled: boolean
  onPrimaryButtonClick: () => void
  onSecondaryButtonClick: () => void
}) => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <>
      <PrimaryButton variant='contained' startIcon={<CreditScore />} disabled={disabled} onClick={onPrimaryButtonClick}>
        {t('applicationApprove')}
      </PrimaryButton>
      <Button
        variant='outlined'
        startIcon={<Delete />}
        color='error'
        disabled={disabled}
        onClick={onSecondaryButtonClick}>
        {t('applicationReject')}
      </Button>
    </>
  )
}

const ButtonsCardApproved = ({
  cardAlreadyCreated,
  primaryButtonHref,
  onSecondaryButtonClick,
}: {
  cardAlreadyCreated: boolean
  primaryButtonHref: string
  onSecondaryButtonClick: () => void
}) => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <>
      <Tooltip title={t('incompleteMappingTooltip')}>
        {/* Make the outer Tooltip independent of the button's disabled state */}
        <span>
          <PrimaryButton variant='contained' href={primaryButtonHref} startIcon={<CreditScore />}>
            {cardAlreadyCreated ? t('createCardAgain') : t('createCard')}
          </PrimaryButton>
        </span>
      </Tooltip>
      <Button onClick={onSecondaryButtonClick} startIcon={<Delete />} variant='outlined' color='error'>
        {t('deleteApplication')}
      </Button>
    </>
  )
}

const StatusNote = ({ statusResolvedDate, status }: { statusResolvedDate: Date; status: ApplicationStatus }) => {
  const { t } = useTranslation('applicationsOverview')

  const isApproved = [ApplicationStatus.Approved, ApplicationStatus.ApprovedCardCreated].includes(status)

  return (
    <Stack direction='row' sx={{ padding: 2, alignItems: 'center' }}>
      <InfoOutline />
      &ensp;
      {t('applicationResolveNotice', {
        date: format(statusResolvedDate, 'dd MMMM', { locale: de }),
        time: format(statusResolvedDate, 'HH:mm', { locale: de }),
      })}
      &ensp;
      <Typography sx={{ fontWeight: 'bold' }} color={isApproved ? 'success' : 'error'}>
        {t(isApproved ? 'applicationResolveApproved' : 'applicationResolveRejected')}
      </Typography>
      .
    </Stack>
  )
}

export type ApplicationCardProps = {
  application: GetApplicationsType
  isSelectedForPrint: boolean
  onDelete: () => void
  onChange: (application: GetApplicationsType) => void
  onPrintApplicationById: (applicationId: number) => void
}

const ApplicationCard = ({
  application,
  isSelectedForPrint,
  onDelete,
  onChange,
  onPrintApplicationById,
}: ApplicationCardProps) => {
  const { t } = useTranslation('applicationsOverview')
  const theme = useTheme()
  const jsonValueParsed: JsonField<'Array'> = JSON.parse(application.jsonValue)
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${application.id}`
  const appToaster = useAppToaster()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [openNoteDialog, setOpenNoteDialog] = useState(false)
  const [accordionExpanded, accordionExpandedSet] = useState(false)

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

  const [approveStatus, approveStatusResult] = useApproveApplicationStatusMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: result => {
      // Update the application with new fields from the query
      onChange({ ...application, ...result.updates })
      appToaster?.show({ intent: 'success', message: t('applicationApprovedToastMessage') })
    },
  })

  const createCardQuery = useMemo(
    () =>
      `./cards/add${config.applicationFeature?.applicationJsonToCardQuery(jsonValueParsed)}` +
      `&applicationIdToMarkAsProcessed=${application.id}`,
    [config.applicationFeature, jsonValueParsed, application.id]
  )
  const personalData = useMemo(
    () => config.applicationFeature?.applicationJsonToPersonalData(jsonValueParsed),
    [config.applicationFeature, jsonValueParsed]
  )

  return (
    <Accordion
      sx={{ displayPrint: isSelectedForPrint ? 'block' : 'none' }}
      disableGutters
      aria-controls='panel-content'
      onChange={(_, expanded) => accordionExpandedSet(expanded)}>
      <AccordionSummary
        // Need this to display the `expandIconWrapper` slot, even if this is not directly used.
        expandIcon={<ExpandMore />}
        slots={{ expandIconWrapper: AccordionExpandButton }}
        slotProps={{
          // @ts-expect-error Currently, MUI apparently cannot properly forward prop types from the slots
          expandIconWrapper: { expanded: accordionExpanded },
        }}
        sx={{ flexDirection: 'column', alignItems: 'stretch', padding: 0 }}>
        <Stack direction='row' sx={{ width: '100%', gap: 2, paddingLeft: 2, paddingRight: 2 }}>
          <Typography variant='h4' sx={{ minWidth: '250px' }}>
            {t('applicationFrom')} {formatDateWithTimezone(application.createdDate, config.timezone)}
          </Typography>
          <Warning color='warning' visibility={application.withdrawalDate !== null ? 'visible' : 'hidden'} />
          <Typography
            variant='h4'
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              color: theme.palette.text.secondary,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              displayPrint: 'none',
            }}>
            {personalData &&
              personalData.forenames !== undefined &&
              personalData.surname !== undefined &&
              `${t('name')}: ${personalData.surname}, ${personalData.forenames}`}
          </Typography>
          <ApplicationIndicators application={application} applicationJsonData={jsonValueParsed} />
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack sx={{ p: 2, gap: 2 }}>
          <Stack direction='row' spacing={2} alignItems='flex-start'>
            {application.withdrawalDate ? (
              <Box sx={{ bgcolor: theme.palette.warning.light, p: 2, flexGrow: 1 }}>
                {t('withdrawalMessage', {
                  withdrawalDate: formatDateWithTimezone(application.withdrawalDate, config.timezone),
                })}
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
              jsonField={jsonValueParsed}
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

        {application.status != null && application.statusResolvedDate != null && (
          <StatusNote statusResolvedDate={new Date(application.statusResolvedDate)} status={application.status} />
        )}

        <Stack sx={{ p: 2, displayPrint: 'none' }} spacing={2} direction='row'>
          {application.status === ApplicationStatus.Pending ? (
            <ButtonsCardPending
              disabled={approveStatusResult.loading}
              onPrimaryButtonClick={() => {
                approveStatus({ variables: { applicationId: application.id } })
              }}
              onSecondaryButtonClick={() => {
                // TODO: #1982
                // resolveStatus({ variables: { applicationId: application.id, approve: false } })
              }}
            />
          ) : undefined}

          {application.status === ApplicationStatus.Approved ||
          application.status === ApplicationStatus.ApprovedCardCreated ? (
            <ButtonsCardApproved
              cardAlreadyCreated={application.status === ApplicationStatus.ApprovedCardCreated}
              primaryButtonHref={createCardQuery}
              onSecondaryButtonClick={() => setDeleteDialogOpen(true)}
            />
          ) : undefined}

          <Button
            onClick={() => onPrintApplicationById(application.id)}
            startIcon={<Print />}
            variant='outlined'
            color='inherit'>
            {t('exportPdf')}
          </Button>
        </Stack>

        <DeleteDialog
          isOpen={deleteDialogOpen}
          deleteResult={deleteResult}
          onConfirm={() => deleteApplication({ variables: { applicationId: application.id } })}
          onCancel={() => setDeleteDialogOpen(false)}
        />
      </AccordionDetails>
    </Accordion>
  )
}

export default memo(ApplicationCard)
