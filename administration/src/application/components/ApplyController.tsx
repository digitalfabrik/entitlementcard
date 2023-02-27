import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { useAddEakApplicationMutation, useGetDataPolicyQuery, useGetRegionsQuery } from '../../generated/graphql'
import { DialogActions, Typography } from '@mui/material'
import useVersionedLocallyStoredState from '../useVersionedLocallyStoredState'
import { useGarbageCollectArrayBuffers, useInitializeGlobalArrayBuffersManager } from '../globalArrayBuffersManager'
import ApplicationForm from './forms/ApplicationForm'
import { useCallback, useContext, useMemo, useState } from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack'
import styled from 'styled-components'
import DiscardAllInputsButton from './DiscardAllInputsButton'
import ApplicationErrorBoundary from '../ApplicationErrorBoundary'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ErrorHandler from '../../ErrorHandler'
import { Spinner } from '@blueprintjs/core'

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

const ApplyController = (): React.ReactElement | null => {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const [addBlueEakApplication, { loading }] = useAddEakApplicationMutation({
    onError: error => {
      console.error(error)
      enqueueSnackbar('Beim Absenden des Antrags ist ein Fehler aufgetreten.', { variant: 'error' })
    },
    onCompleted: result => {
      if (result) {
        setState(() => ApplicationForm.initialState)
        setFormSubmitted(true)
      } else {
        enqueueSnackbar('Beim Absenden des Antrags ist ein Fehler aufgetreten.', { variant: 'error' })
      }
    },
  })
  const { status, state, setState } = useVersionedLocallyStoredState(
    ApplicationForm.initialState,
    applicationStorageKey,
    lastCommitForApplicationForm
  )
  const {
    loading: loadingPolicy,
    error: errorPolicy,
    data: policyData,
    refetch: refetchPolicy,
  } = useGetDataPolicyQuery({
    variables: { regionId: regionId },
    onError: () => enqueueSnackbar('Datenschutzerklärung konnte nicht geladen werden', { variant: 'error' }),
  })
  const projectId = useContext(ProjectConfigContext).projectId
  const {
    loading: loadingRegions,
    error,
    data: regionData,
    refetch: refetchRegions,
  } = useGetRegionsQuery({
    variables: { project: projectId },
  })
  const regions = useMemo(
    () => (regionData ? [...regionData.regions].sort((a, b) => a.name.localeCompare(b.name)) : null),
    [regionData]
  )
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
    const validationResult = ApplicationForm.validate(state, { regions: [] })
    console.log(state)
    if (validationResult.type === 'error') {
      enqueueSnackbar('Ungültige bzw. fehlende Eingaben entdeckt. Bitte prüfen Sie die rot markierten Felder.', {
        variant: 'error',
      })
      return
    }
    const [regionId, application] = validationResult.value

    addBlueEakApplication({
      variables: { regionId, application },
    })
  }
  const successText = `Ihr Antrag für die Ehrenamtskarte wurde erfolgreich übermittelt.
            Über den Fortschritt Ihres Antrags werden Sie per E-Mail informiert.
            Sie können das Fenster jetzt schließen.`

  if (loadingRegions || loadingPolicy) return <Spinner />
  else if (error || !regions) return <ErrorHandler refetch={refetchRegions} />
  else if (errorPolicy || !policyData) return <ErrorHandler refetch={refetchPolicy} />

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', margin: '16px' }}>
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <Typography variant='h4' component='h1' style={{ textAlign: 'center', margin: '16px' }}>
          {formSubmitted ? 'Erfolgreich gesendet' : 'Bayerische Ehrenamtskarte beantragen'}
        </Typography>
        {formSubmitted ? (
          <SuccessContent>
            <Typography>{successText}</Typography>
          </SuccessContent>
        ) : (
          <ApplicationForm.Component
            state={state}
            setState={setState}
            onSubmit={submit}
            loading={loading || loadingPolicy}
            privacyPolicy={policyData?.dataPolicy.dataPrivacyPolicy ?? ''}
            options={{ regions: regions }}
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
