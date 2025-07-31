/* eslint-disable react/destructuring-assignment */
import { MutationResult } from '@apollo/client'
import {
  CancelOutlined,
  Check,
  CheckCircleOutline,
  Close,
  CreditScore,
  Delete,
  ExpandMore,
  InfoOutline,
  PrintOutlined,
  Search,
  Warning,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import React, { memo, useContext, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { CsvIcon } from '../../components/icons/CsvIcon'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApplicationStatus,
  useApproveApplicationStatusMutation,
  useDeleteApplicationMutation,
  useRejectApplicationStatusMutation,
} from '../../generated/graphql'
import BaseMenu, { MenuItemType } from '../../mui-modules/base/BaseMenu'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import type { ProjectConfig } from '../../project-configs/getProjectConfig'
import { ApplicationDataIncompleteError } from '../../util/applicationDataHelper'
import formatDateWithTimezone from '../../util/formatDate'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { useAppToaster } from '../AppToaster'
import { AccordionExpandButton } from '../components/AccordionExpandButton'
import JsonFieldView from './JsonFieldView'
import NoteDialogController from './NoteDialogController'
import VerificationsView from './VerificationsView'
import { ApplicationIndicators } from './components/VerificationsIndicator'
import type { Application } from './types'
import { ApplicationToCsvError, exportApplicationToCsv } from './utils/exportApplicationToCsv'

const DeleteDialog = (props: {
  isOpen: boolean
  deleteResult: MutationResult
  onConfirm: () => void
  onCancel: () => void
}) => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <Dialog open={props.isOpen} aria-describedby='alert-dialog-description'>
      <DialogContent id='alert-dialog-description'>
        <Stack direction='row' sx={{ gap: 2, alignItems: 'center' }}>
          {props.deleteResult.loading || props.deleteResult.called ? (
            <CircularProgress size={64} />
          ) : (
            <Delete sx={{ fontSize: '64px' }} color='error' />
          )}
          {t('deleteApplicationConfirmationPrompt')}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={props.deleteResult.loading || props.deleteResult.called} onClick={props.onCancel}>
          {t('misc:cancel')}
        </Button>
        <Button
          color='error'
          disabled={props.deleteResult.loading || props.deleteResult.called}
          onClick={props.onConfirm}>
          {t('deleteApplication')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const RejectionDialog = (props: {
  open: boolean
  loading: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}) => {
  const { t } = useTranslation('applicationsOverview')
  const rejectionMessages = t('rejectionReasons', { returnObjects: true }) as string[]
  const [reason, setReason] = useState<string | null>(null)

  return (
    <Dialog open={props.open} aria-describedby='reject-dialog-description' fullWidth onClose={props.onCancel}>
      <DialogTitle>{t('rejectionDialogTitle')}</DialogTitle>
      <DialogContent id='reject-dialog-description'>
        {t('rejectionDialogMessage')}
        <Autocomplete
          renderInput={params => (
            <TextField
              {...params}
              variant='outlined'
              label={t('rejectionInputHint')}
              slotProps={{
                input: {
                  ...params.InputProps,
                  size: 'small',
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
          options={rejectionMessages}
          sx={{ marginTop: 2 }}
          onChange={(_, value) => setReason(value)}
        />
      </DialogContent>
      <DialogActions sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
        <Button
          variant='outlined'
          color='default.dark'
          onClick={() => {
            setReason(null)
            props.onCancel()
          }}
          disabled={props.loading}
          startIcon={<Close />}>
          {t('misc:cancel')}
        </Button>
        <Button
          variant='contained'
          startIcon={<CheckCircleOutline />}
          disabled={reason === null || props.loading}
          onClick={() => {
            if (reason !== null) {
              props.onConfirm(reason)
            }
          }}>
          {t('rejectionButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const ButtonsApplicationPending = (props: {
  disabled: boolean
  onPrimaryButtonClick: () => void
  onSecondaryButtonClick: () => void
}) => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <>
      <Button
        variant='contained'
        color='primary'
        startIcon={<Check />}
        disabled={props.disabled}
        onClick={props.onPrimaryButtonClick}>
        {t('applicationApprove')}
      </Button>
      <Button
        variant='outlined'
        startIcon={<CancelOutlined />}
        color='error'
        disabled={props.disabled}
        onClick={props.onSecondaryButtonClick}>
        {t('applicationReject')}
      </Button>
    </>
  )
}

const ButtonsApplicationResolved = (props: {
  applicationStatus: ApplicationStatus | null | undefined // TODO Remove null|undefined once this type is narrowed
  primaryButtonHref: string | undefined
  onSecondaryButtonClick: () => void
}) => {
  const { t } = useTranslation('applicationsOverview')

  return (
    <>
      {/* Make the outer Tooltip independent of the button's disabled state */}
      {(props.applicationStatus === ApplicationStatus.Approved ||
        props.applicationStatus === ApplicationStatus.ApprovedCardCreated) && (
        <Tooltip title={props.primaryButtonHref ? undefined : t('incompleteApplicationDataTooltip')}>
          <div>
            <Button
              color='primary'
              variant='contained'
              disabled={props.primaryButtonHref === undefined}
              href={props.primaryButtonHref}
              startIcon={<CreditScore />}>
              {' '}
              {props.applicationStatus === ApplicationStatus.ApprovedCardCreated
                ? t('createCardAgain')
                : t('createCard')}
            </Button>
          </div>
        </Tooltip>
      )}
      <Button onClick={props.onSecondaryButtonClick} startIcon={<Delete />} variant='outlined' color='error'>
        {t('deleteApplication')}
      </Button>
    </>
  )
}

const statusTranslationKey = (applicationStatus: ApplicationStatus): string | undefined => {
  switch (applicationStatus) {
    case ApplicationStatus.Approved:
    case ApplicationStatus.ApprovedCardCreated:
      return 'applicationResolveNoticeApproved'
    case ApplicationStatus.Rejected:
      return 'applicationResolveNoticeRejected'
    case ApplicationStatus.Withdrawn:
      return 'applicationResolveNoticeWithdrawn'
    case ApplicationStatus.Pending:
      return undefined
  }
}

// Return type should actually be ComponentProps<typeof Typography>['color'] | undefined, but this type is too generic
const statusColor = (applicationStatus: ApplicationStatus): string | undefined => {
  switch (applicationStatus) {
    case ApplicationStatus.Approved:
    case ApplicationStatus.ApprovedCardCreated:
      return 'success'
    case ApplicationStatus.Rejected:
      return 'error'
    case ApplicationStatus.Withdrawn:
      return 'warning'
    case ApplicationStatus.Pending:
      return undefined
  }
}

const StatusNote = (props: { statusResolvedDate: Date; status: ApplicationStatus; reason: string | undefined }) => {
  const { t } = useTranslation('applicationsOverview')
  const translationKey = statusTranslationKey(props.status)
  const color = statusColor(props.status)

  return (
    <Stack direction='row' sx={{ padding: 2, alignItems: 'flex-start' }}>
      <InfoOutline />
      &ensp;
      <div>
        {translationKey !== undefined && color !== undefined && (
          <Trans
            t={t}
            i18nKey={translationKey}
            values={{
              date: format(props.statusResolvedDate, 'dd MMMM', { locale: de }),
              time: format(props.statusResolvedDate, 'HH:mm', { locale: de }),
              reason: props.reason,
            }}
            components={{
              resolution: <Typography component='span' sx={{ fontWeight: 'bold' }} color={color} />,
            }}
          />
        )}
      </div>
    </Stack>
  )
}

/** Returns a link to the create card route. Might be undefined, if the application data cannot be mapped to a query. */
const createCardLink = (application: Application, config: ProjectConfig): string | undefined => {
  const query = config.applicationFeature?.applicationJsonToCardQuery(application.jsonValue)
  // TODO: This URL should be generated by a router function
  return query ? `./cards/add${query}&applicationIdToMarkAsProcessed=${application.id}` : undefined
}

const ApplicationCard = ({
  application,
  isSelectedForPrint,
  onDelete,
  onChange,
  onPrintApplicationById,
}: {
  application: Application
  isSelectedForPrint: boolean
  onDelete: () => void
  onChange: (application: Application) => void
  onPrintApplicationById: (applicationId: number) => void
}) => {
  const { t } = useTranslation('applicationsOverview')
  const theme = useTheme()
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${application.id}`
  const appToaster = useAppToaster()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [openNoteDialog, setOpenNoteDialog] = useState(false)
  const [accordionExpanded, setAccordionExpanded] = useState(false)

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

  const [rejectStatus, rejectStatusResult] = useRejectApplicationStatusMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appToaster?.show({ intent: 'danger', message: title })
    },
    onCompleted: result => {
      setRejectionDialogOpen(false)
      // Update the application with new fields from the query
      onChange({ ...application, ...result.application })
      appToaster?.show({ intent: 'success', message: t('applicationRejectedToastMessage') })
    },
  })

  const personalData = useMemo(
    () => config.applicationFeature?.applicationJsonToPersonalData(application.jsonValue),
    [config.applicationFeature, application.jsonValue]
  )

  const menuItems: MenuItemType[] = [
    {
      name: t('exportCsv'),
      onClick: () => {
        try {
          exportApplicationToCsv(application, config)
        } catch (error) {
          if (error instanceof ApplicationToCsvError || error instanceof ApplicationDataIncompleteError) {
            appToaster?.show({ message: error.message, intent: 'danger' })
          }
        }
      },
      icon: <CsvIcon sx={{ height: 20 }} />,
    },
    {
      name: t('exportPdf'),
      onClick: () => onPrintApplicationById(application.id),
      icon: <PrintOutlined sx={{ height: 20 }} />,
    },
  ]

  return (
    <Accordion
      sx={{ displayPrint: isSelectedForPrint ? 'block' : 'none' }}
      disableGutters
      aria-controls='panel-content'
      onChange={(_, expanded) => setAccordionExpanded(expanded)}>
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
          <Warning
            color='warning'
            visibility={application.status === ApplicationStatus.Withdrawn ? 'visible' : 'hidden'}
          />
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
          <ApplicationIndicators application={application} />
        </Stack>
      </AccordionSummary>

      <AccordionDetails sx={{ position: 'relative' }}>
        <Stack sx={{ spacing: 2, alignItems: 'flex-start', gap: 2 }}>
          <Stack sx={{ gap: 2, flexGrow: 1, marginLeft: 2, marginBottom: 2, alignItems: 'flex-start' }}>
            {application.status === ApplicationStatus.Withdrawn && !!application.statusResolvedDate && (
              <Box sx={{ bgcolor: theme.palette.warning.light, padding: 2 }}>
                {t('withdrawalMessage', {
                  withdrawalDate: formatDateWithTimezone(application.statusResolvedDate, config.timezone),
                })}
                <br />
                {t('deleteApplicationSoonPrompt')}
              </Box>
            )}
            {/* TODO: <JsonFieldView> does not emit a root element and thus, <Stack> would insert a gap here */}
            <Box>
              <JsonFieldView
                jsonField={application.jsonValue}
                baseUrl={baseUrl}
                key={0}
                hierarchyIndex={0}
                attachmentAccessible
                expandedRoot={false}
              />
            </Box>
          </Stack>
        </Stack>

        <Divider />

        <Box sx={{ p: 2 }}>
          <VerificationsView application={application} isAdminView />
        </Box>

        <Divider />

        {application.statusResolvedDate != null && (
          <StatusNote
            statusResolvedDate={new Date(application.statusResolvedDate)}
            status={application.status}
            reason={application.rejectionMessage ?? undefined}
          />
        )}

        <Stack sx={{ p: 2, displayPrint: 'none' }} spacing={2} direction='row'>
          {application.status === ApplicationStatus.Pending ? (
            <ButtonsApplicationPending
              disabled={approveStatusResult.loading}
              onPrimaryButtonClick={() => {
                approveStatus({ variables: { applicationId: application.id } })
              }}
              onSecondaryButtonClick={() => setRejectionDialogOpen(true)}
            />
          ) : (
            <ButtonsApplicationResolved
              applicationStatus={application.status}
              primaryButtonHref={createCardLink(application, config)}
              onSecondaryButtonClick={() => setDeleteDialogOpen(true)}
            />
          )}

          <BaseMenu menuItems={menuItems} menuLabel={t('moreActionsButtonLabel')} />
        </Stack>

        <DeleteDialog
          isOpen={deleteDialogOpen}
          deleteResult={deleteResult}
          onConfirm={() => deleteApplication({ variables: { applicationId: application.id } })}
          onCancel={() => setDeleteDialogOpen(false)}
        />

        <RejectionDialog
          open={rejectionDialogOpen}
          loading={rejectStatusResult.loading}
          onConfirm={message => {
            rejectStatus({
              variables: { applicationId: application.id, rejectionMessage: message },
            })
          }}
          onCancel={() => {
            setRejectionDialogOpen(false)
          }}
        />
        <Box sx={{ position: 'absolute', top: 0, right: theme.spacing(2), zIndex: 1 }}>
          <NoteDialogController
            application={application}
            isOpen={openNoteDialog}
            onOpenNoteDialog={setOpenNoteDialog}
            onChange={onChange}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  )
}

export default memo(ApplicationCard)
