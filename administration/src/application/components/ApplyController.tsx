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
import { useCallback, useMemo } from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack'
import ApplicationErrorBoundary from '../ApplicationErrorBoundary'

// This env variable is determined by '../../../application_commit.sh'. It holds the hash of the last commit to the
// application form.
const lastCommitForApplicationForm = process.env.REACT_APP_APPLICATION_COMMIT as string

export const applicationStorageKey = 'applicationState'
const regionId = 1 // TODO: Add a mechanism to retrieve the regionId

const ApplyController = () => {
  const [addBlueEakApplication, { loading }] = useAddBlueEakApplicationMutation()
  const { status, state, setState } = useVersionedLocallyStoredState(
    ApplicationForm.initialState,
    applicationStorageKey,
    lastCommitForApplicationForm
  )
  const { loading, data: policyData } = useGetDataPolicyQuery({
    variables: { regionId: regionId },
    onError: error => console.error(error),
  })
  const arrayBufferManagerInitialized = useInitializeGlobalArrayBuffersManager()
  const getArrayBufferKeys = useMemo(
    () => (status === 'loading' ? null : () => ApplicationForm.getArrayBufferKeys(state)),
    [state, status]
  )
  const { enqueueSnackbar } = useSnackbar()
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

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', margin: '16px' }}>
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Blaue Ehrenamtskarte beantragen</h2>
        <ApplicationForm.Component state={state} setState={setState} onSubmit={submit} loading={loading} privacyPolicy={policyData?.dataPolicy.dataPrivacyPolicy ?? ''} />
        <DialogActions>{loading ? null : <DiscardAllInputsButton discardAll={discardAll} />}</DialogActions>
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
