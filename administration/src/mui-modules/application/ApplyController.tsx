import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { Box, Typography } from '@mui/material'
import { SnackbarProvider, useSnackbar } from 'notistack'
import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import getMessageFromApolloError from '../../errors/getMessageFromApolloError'
import { useAddEakApplicationMutation, useGetRegionsQuery } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import CenteredCircularProgress from '../base/CenteredCircularProgress'
import getQueryResult from '../util/getQueryResult'
import ApplicationErrorBoundary from './ApplicationErrorBoundary'
import DiscardAllInputsButton from './DiscardAllInputsButton'
import { applicationStorageKey } from './constants'
import ApplicationForm from './forms/ApplicationForm'
import useVersionedLocallyStoredState from './hooks/useVersionedLocallyStoredState'
import { useGarbageCollectArrayBuffers, useInitializeGlobalArrayBuffersManager } from './util/globalArrayBuffersManager'

// This env variable is determined by '../../../application_commit.sh'. It holds the hash of the last commit to the
// application form.
const lastCommitForApplicationForm = process.env.REACT_APP_APPLICATION_COMMIT as string

const SuccessContent = styled.div`
  white-space: pre-line;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`

const ApplyController = (): React.ReactElement | null => {
  const { t } = useTranslation('applicationForms')
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const { status, state, setState } = useVersionedLocallyStoredState(
    ApplicationForm.initialState,
    applicationStorageKey,
    lastCommitForApplicationForm
  )
  const [addEakApplication, { loading: loadingSubmit }] = useAddEakApplicationMutation({
    onError: error => {
      const { title } = getMessageFromApolloError(error)
      enqueueSnackbar(title, { variant: 'error', style: { whiteSpace: 'pre-line' }, autoHideDuration: 7200 })
    },
    onCompleted: ({ result }) => {
      if (result) {
        setState(() => ApplicationForm.initialState)
        setFormSubmitted(true)
      }
    },
  })

  const projectId = useContext(ProjectConfigContext).projectId
  const regionsQuery = useGetRegionsQuery({
    variables: { project: projectId },
  })
  const regionsQueryResult = getQueryResult(regionsQuery)
  const arrayBufferManagerInitialized = useInitializeGlobalArrayBuffersManager()
  const getArrayBufferKeys = useMemo(
    () => (status === 'loading' ? null : () => ApplicationForm.getArrayBufferKeys(state)),
    [state, status]
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

  const submit = () => {
    const validationResult = ApplicationForm.validate(state, { regions })
    if (validationResult.type === 'error') {
      enqueueSnackbar(t('invalidInputError'), {
        variant: 'error',
      })
      return
    }
    const [regionId, application] = validationResult.value

    addEakApplication({
      variables: { regionId, application, project: projectId },
    })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', margin: '16px' }}>
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <Typography variant='h4' component='h1' style={{ textAlign: 'center', margin: '16px' }}>
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
            loading={loadingSubmit}
            options={{ regions }}
          />
        )}
        <Box sx={{ justifyContent: 'flex-end', display: 'flex', marginY: 2 }}>
          {loadingSubmit || formSubmitted ? null : <DiscardAllInputsButton discardAll={discardAll} />}
        </Box>
      </div>
    </div>
  )
}

const ApplyApp = (): ReactElement => (
  <SnackbarProvider>
    <ApplicationErrorBoundary>
      <ApplyController />
    </ApplicationErrorBoundary>
  </SnackbarProvider>
)

export default ApplyApp
