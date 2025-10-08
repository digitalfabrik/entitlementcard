/* eslint-disable react/destructuring-assignment */
import { MutationResult } from '@apollo/client'
import {
  CancelOutlined,
  Check,
  CreditScore,
  Delete,
  ExpandMore,
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
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import React, { memo, useContext, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useReactToPrint } from 'react-to-print'

import { useAppSnackbar } from '../../AppSnackbar'
import { CsvIcon } from '../../components/icons/CsvIcon'
import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import {
  ApplicationStatus,
  useApproveApplicationStatusMutation,
  useDeleteApplicationMutation,
  useRejectApplicationStatusMutation,
} from '../../generated/graphql'
import ConfirmDialog from '../../mui-modules/application/ConfirmDialog'
import BaseMenu, { MenuItemType } from '../../mui-modules/base/BaseMenu'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import type { ProjectConfig } from '../../project-configs/getProjectConfig'
import JsonFieldView from '../../shared/components/JsonFieldView'
import VerificationsView from '../../shared/components/VerificationsView'
import { ApplicationDataIncompleteError } from '../../util/applicationDataHelper'
import getApiBaseUrl from '../../util/getApiBaseUrl'
import { AccordionExpandButton } from '../components/AccordionExpandButton'
import { ApplicationPrintView, applicationPrintViewPageStyle } from './ApplicationPrintView'
import NoteDialogController from './NoteDialogController'
import { ApplicationStatusNote } from './components/ApplicationStatusNote'
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
    <ConfirmDialog
      open={props.isOpen}
      onClose={props.onCancel}
      title={t('deleteApplication')}
      id='alert-dialog-description'
      onConfirm={props.onConfirm}
      actionDisabled={props.deleteResult.loading || props.deleteResult.called}
      color='error'>
      <Stack direction='row' sx={{ gap: 2, alignItems: 'center' }}>
        {t('deleteApplicationConfirmationPrompt')}
      </Stack>
    </ConfirmDialog>
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

  const closeAndClearDialog = () => {
    setReason(null)
    props.onCancel()
  }

  return (
    <ConfirmDialog
      open={props.open}
      title={t('rejectionDialogTitle')}
      id='reject-dialog-description'
      onConfirm={() => {
        if (reason !== null) {
          props.onConfirm(reason)
        }
      }}
      onClose={closeAndClearDialog}
      cancelButtonText={t('rejectionCancelButton')}
      confirmButtonText={t('rejectionButton')}>
      <>
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
      </>
    </ConfirmDialog>
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
  primaryButtonHref: string
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
            <Link to={props.primaryButtonHref}>
              <Button
                color='primary'
                variant='contained'
                disabled={props.primaryButtonHref.length === 0}
                startIcon={<CreditScore />}>
                {' '}
                {props.applicationStatus === ApplicationStatus.ApprovedCardCreated
                  ? t('createCardAgain')
                  : t('createCard')}
              </Button>
            </Link>
          </div>
        </Tooltip>
      )}
      <Button onClick={props.onSecondaryButtonClick} startIcon={<Delete />} variant='outlined' color='error'>
        {t('deleteApplication')}
      </Button>
    </>
  )
}

/** Returns a link to the create card route. Might be undefined, if the application data cannot be mapped to a query. */
const createCardLink = (application: Application, config: ProjectConfig): string => {
  const query = config.applicationFeature?.applicationJsonToCardQuery(application.jsonValue)
  // TODO: This URL should be generated by a router function
  return query ? `/cards/add${query}&applicationIdToMarkAsProcessed=${application.id}` : ''
}

const ApplicationCard = ({
  application,
  onDelete,
  onChange,
}: {
  application: Application
  onDelete: () => void
  onChange: (application: Application) => void
}) => {
  const { t } = useTranslation('applicationsOverview')
  const theme = useTheme()
  const config = useContext(ProjectConfigContext)
  const baseUrl = `${getApiBaseUrl()}/application/${config.projectId}/${application.id}`
  const appSnackbar = useAppSnackbar()
  const printContentRef = useRef<HTMLDivElement>(null)
  const printApplication = useReactToPrint({
    contentRef: printContentRef,
    pageStyle: applicationPrintViewPageStyle.styles,
    documentTitle: t('applicationFrom', { date: new Date(application.createdDate) }),
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false)
  const [openNoteDialog, setOpenNoteDialog] = useState(false)
  const [accordionExpanded, setAccordionExpanded] = useState(false)

  const [deleteApplication, deleteResult] = useDeleteApplicationMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appSnackbar.enqueueError(title)
    },
    onCompleted: ({ deleted }: { deleted: boolean }) => {
      if (deleted) {
        onDelete()
      } else {
        console.error('Delete operation returned false.')
        appSnackbar.enqueueError(t('errors:unknown'))
      }
    },
  })

  const [approveStatus, approveStatusResult] = useApproveApplicationStatusMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appSnackbar.enqueueError(title)
    },
    onCompleted: result => {
      // Update the application with new fields from the query
      onChange({ ...application, ...result.updates })
      appSnackbar.enqueueSuccess(t('applicationApprovedToastMessage'))
    },
  })

  const [rejectStatus, rejectStatusResult] = useRejectApplicationStatusMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      appSnackbar.enqueueError(title)
    },
    onCompleted: result => {
      setRejectionDialogOpen(false)
      // Update the application with new fields from the query
      onChange({ ...application, ...result.application })
      appSnackbar.enqueueSuccess(t('applicationRejectedToastMessage'))
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
            appSnackbar.enqueueError(error.message)
          }
        }
      },
      icon: <CsvIcon sx={{ height: 20 }} />,
    },
    {
      name: t('exportPdf'),
      onClick: () => {
        printApplication()
      },
      icon: <PrintOutlined sx={{ height: 20 }} />,
    },
  ]

  return (
    <Accordion disableGutters aria-controls='panel-content' onChange={(_, expanded) => setAccordionExpanded(expanded)}>
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
          <Typography variant='h6' sx={{ minWidth: '250px' }} marginY={0}>
            {t('applicationFrom', { date: new Date(application.createdDate) })}
          </Typography>
          <Warning
            color='warning'
            visibility={application.status === ApplicationStatus.Withdrawn ? 'visible' : 'hidden'}
          />
          <Typography
            variant='h6'
            sx={{
              marginY: 0,
              flexGrow: 1,
              flexShrink: 1,
              color: theme.palette.text.secondary,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
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
        <Stack sx={{ spacing: 2, alignItems: 'flex-start', gap: 2, marginLeft: 2, marginBottom: 2, marginRight: 2 }}>
          {application.status === ApplicationStatus.Withdrawn && !!application.statusResolvedDate && (
            <Box sx={{ bgcolor: theme.palette.warning.light, padding: 2 }}>
              {t('withdrawalMessage', { date: new Date(application.statusResolvedDate) })}
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

        <Divider />

        <Box sx={{ p: 2 }}>
          <VerificationsView application={application} isAdminView />
        </Box>

        <Divider />

        {application.statusResolvedDate != null && (
          <Box sx={{ p: 2 }}>
            <ApplicationStatusNote
              showIcon
              statusResolvedDate={new Date(application.statusResolvedDate)}
              status={application.status}
              reason={application.rejectionMessage ?? undefined}
              adminView
            />
          </Box>
        )}

        <Stack sx={{ p: 2, gap: 2, flexDirection: 'row' }}>
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

        <Box sx={{ position: 'absolute', top: 0, right: theme.spacing(2), zIndex: 1 }}>
          <NoteDialogController
            application={application}
            isOpen={openNoteDialog}
            onOpenNoteDialog={setOpenNoteDialog}
            onChange={onChange}
          />
        </Box>
      </AccordionDetails>

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

      <Box sx={{ display: 'none' }}>
        <ApplicationPrintView ref={printContentRef} application={application} />
      </Box>
    </Accordion>
  )
}

export default memo(ApplicationCard)
