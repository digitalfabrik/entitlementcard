import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { useAddBlueEakApplicationMutation, useGetDataPolicyQuery } from '../../generated/graphql'
import { DialogActions } from '@mui/material'
import useVersionedLocallyStoredState from '../useVersionedLocallyStoredState'
import DiscardAllInputsButton from './DiscardAllInputsButton'
import { useGarbageCollectArrayBuffers, useInitializeGlobalArrayBuffersManager } from '../globalArrayBuffersManager'
import ApplicationForm from './forms/ApplicationForm'
import { useCallback, useMemo, useState } from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack'
import styled from 'styled-components'
import ApplicationErrorBoundary from '../ApplicationErrorBoundary'
import { useAppToaster } from '../../components/AppToaster'

// This env variable is determined by '../../../application_commit.sh'. It holds the hash of the last commit to the
// application form.
const lastCommitForApplicationForm = process.env.REACT_APP_APPLICATION_COMMIT as string

export const applicationStorageKey = 'applicationState'
const regionId = 1 // TODO: Add a mechanism to retrieve the regionId

const SuccessContent = styled.div`
  white-space: pre-line;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`

const ApplyController = () => {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const [addBlueEakApplication, { loading }] = useAddBlueEakApplicationMutation({
    onError: error => {
      console.error(error)
      enqueueSnackbar('Beim Absenden des Antrags is ein Fehler aufgetreten', { variant: 'error' })
    },
    onCompleted: result => {
      if (result) {
        setState(() => ApplicationForm.initialState)
        setFormSubmitted(true)
      } else {
        enqueueSnackbar('Beim Absenden des Antrags is ein Fehler aufgetreten.', { variant: 'error' })
      }
    },
  })
  const appToaster = useAppToaster()
  const { status, state, setState } = useVersionedLocallyStoredState(
    ApplicationForm.initialState,
    applicationStorageKey,
    lastCommitForApplicationForm
  )
  const { loading: loadingPolicy, data: policyData } = useGetDataPolicyQuery({
    variables: { regionId: regionId },
    // TODO: Add proper error handling and a refetch button when regionId query is implemented
    // TODO: Use enqueueSnackbar from notistack instead of the appToaster
    onError: () => appToaster?.show({ intent: 'danger', message: 'Datenschutzerklärung konnte nicht geladen werden' }),
  })
  const arrayBufferManagerInitialized = useInitializeGlobalArrayBuffersManager()
  const getArrayBufferKeys = useMemo(
    () => (status === 'loading' ? null : () => ApplicationForm.getArrayBufferKeys(state)),
    [state, status]
  )
  useGarbageCollectArrayBuffers(getArrayBufferKeys)

  const discardAll = useCallback(() => setState(() => ApplicationForm.initialState), [setState])

  if (status === 'loading' || !arrayBufferManagerInitialized) {
    return null
  }

  const submit = () => {
    const application = ApplicationForm.getValidatedInput(state)
    if (application.type === 'error') {
      enqueueSnackbar('Ungültige bzw. fehlende Eingaben entdeckt. Bitte prüfen Sie die rot markierten Felder.', {
        variant: 'error',
      })
      return
    }

    const [regionId, applicationInput] = application.value // TODO: Add a mechanism to retrieve the regionId

    addBlueEakApplication({
      variables: {
        regionId,
        application: applicationInput,
      },
    })
  }
  const successText = `Ihr Antrag für die Ehrenamtskarte wurde erfolgreich übermittelt.
            Sie können das Fenster schließen.`

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', margin: '16px' }}>
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>{formSubmitted ? 'Erfolgreich gesendet' : 'Ehrenamtskarte beantragen'}</h2>
        {formSubmitted ? (
          <SuccessContent>{successText}</SuccessContent>
        ) : (
          <ApplicationForm.Component
            state={state}
            setState={setState}
            onSubmit={submit}
            loading={loading || loadingPolicy}
            privacyPolicy={policyData?.dataPolicy.dataPrivacyPolicy ?? ''}
          />
        )}
        <DialogActions>
          {loading || loadingPolicy || formSubmitted ? null : <DiscardAllInputsButton discardAll={discardAll} />}
        </DialogActions>
      </div>
    </div>
  )
}

const ApplyApp = () => (
  <SnackbarProvider>
    <ApplicationErrorBoundary>
      <ApplyController />
    </ApplicationErrorBoundary>
  </SnackbarProvider>
)

export default ApplyApp
