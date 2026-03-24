import { Box, Typography, styled } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'urql'

import CenteredCircularProgress from '../../components/CenteredCircularProgress'
import PageLayout from '../../components/PageLayout'
import { messageFromGraphQlError } from '../../errors'
import { AddEakApplicationDocument, GetRegionsDocument } from '../../graphql'
import { ProjectConfigContext } from '../../provider/ProjectConfigContext'
import getQueryResult from '../../util/getQueryResult'
import { reportErrorToSentry } from '../../util/sentry'
import ApplicationErrorBoundary from './components/ApplicationErrorBoundary'
import DiscardAllInputsButton from './components/DiscardAllInputsButton'
import ApplicationForm from './components/forms/ApplicationForm'
import { applicationStorageKey } from './constants'
import useVersionedLocallyStoredState from './hooks/useVersionedLocallyStoredState'
import {
  useGarbageCollectArrayBuffers,
  useInitializeGlobalArrayBuffersManager,
} from './util/globalArrayBuffersManager'

// This env variable is determined by '../../../application_commit.sh'. It holds the hash of the last commit to the
// application form.
const lastCommitForApplicationForm = VITE_BUILD_COMMIT

const SuccessContent = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  whiteSpace: 'pre-line',
  display: 'flex',
  justifyContent: 'center',
}))

const ApplyController = (): React.ReactElement | null => {
  const { t } = useTranslation('applicationForms')
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const { status, state, setState } = useVersionedLocallyStoredState(
    ApplicationForm.initialState,
    applicationStorageKey,
    lastCommitForApplicationForm,
  )
  const projectId = useContext(ProjectConfigContext).projectId
  const [addEakApplicationState, addEakApplicationMutation] = useMutation(AddEakApplicationDocument)
  const [regionsState, regionsQuery] = useQuery({
    query: GetRegionsDocument,
    variables: { project: projectId },
  })
  const regionsQueryResult = getQueryResult(regionsState, regionsQuery)
  const arrayBufferManagerInitialized = useInitializeGlobalArrayBuffersManager()
  const getArrayBufferKeys = useMemo(
    () => (status === 'loading' ? null : () => ApplicationForm.getArrayBufferKeys(state)),
    [state, status],
  )
  useGarbageCollectArrayBuffers(getArrayBufferKeys)

  const discardAll = useCallback(() => setState(() => ApplicationForm.initialState), [setState])

  if (status === 'loading' || !arrayBufferManagerInitialized) {
    return <CenteredCircularProgress />
  }

  if (!regionsQueryResult.successful) {
    return regionsQueryResult.component
  }

  const regions = regionsQueryResult.data.regions.filter(region => region.activatedForApplication)

  const submit = async () => {
    const validationResult = ApplicationForm.validate(state, { regions })
    if (validationResult.type === 'error') {
      enqueueSnackbar(t('invalidInputError'), { variant: 'error' })
      return
    }
    const [regionId, application] = validationResult.value

    const result = await addEakApplicationMutation({ regionId, application, project: projectId })
    if (result.error) {
      const { title } = messageFromGraphQlError(result.error)
      enqueueSnackbar(title, {
        variant: 'error',
        style: { whiteSpace: 'pre-line' },
        autoHideDuration: 7200,
      })
      // 2851: Add error logging to get more client information
      reportErrorToSentry(result.error)
    } else if (result.data?.result) {
      setState(() => ApplicationForm.initialState)
      setFormSubmitted(true)
    }
  }

  return (
    <PageLayout
      showDataPrivacy={false}
      containerSx={{
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'start',
        margin: 2,
      }}
    >
      <Box sx={{ maxWidth: '1000px', width: '100%' }}>
        <Typography variant='h4' component='h1' margin={2} textAlign='center'>
          {formSubmitted ? t('sentSuccessfully') : t('title')}
        </Typography>
        {formSubmitted ? (
          <SuccessContent>
            <Typography>
              <Trans i18nKey='applicationForms:submitSuccessText' />
            </Typography>
          </SuccessContent>
        ) : (
          <ApplicationForm.Component
            state={state}
            setState={setState}
            onSubmit={submit}
            loading={addEakApplicationState.fetching}
            options={{ regions }}
          />
        )}
        <Box sx={{ justifyContent: 'flex-end', display: 'flex', marginY: 2 }}>
          {addEakApplicationState.fetching || formSubmitted ? null : (
            <DiscardAllInputsButton discardAll={discardAll} />
          )}
        </Box>
      </Box>
    </PageLayout>
  )
}

const ApplyApp = (): ReactElement => (
  <ApplicationErrorBoundary>
    <ApplyController />
  </ApplicationErrorBoundary>
)

export default ApplyApp
