import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { useAddEakApplicationMutation, useGetRegionsQuery } from '../../generated/graphql'
import { CircularProgress, DialogActions, Typography } from '@mui/material'
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

// This env variable is determined by '../../../application_commit.sh'. It holds the hash of the last commit to the
// application form.
const lastCommitForApplicationForm = process.env.REACT_APP_APPLICATION_COMMIT as string

export const applicationStorageKey = 'applicationState'

const SuccessContent = styled.div`
  white-space: pre-line;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`

const ApplyController = (): React.ReactElement | null => {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()
  const [addBlueEakApplication, { loading: loadingSubmit }] = useAddEakApplicationMutation({
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

  const projectId = useContext(ProjectConfigContext).projectId
  const {
    loading: loadingRegions,
    error: errorRegions,
    data: regionsData,
    refetch: refetchRegions,
  } = useGetRegionsQuery({
    variables: { project: projectId },
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

  const successText = `Ihr Antrag für die Ehrenamtskarte wurde erfolgreich übermittelt.
            Über den Fortschritt Ihres Antrags werden Sie per E-Mail informiert.
            Sie können das Fenster jetzt schließen.`

  if (loadingRegions) return <CircularProgress style={{ margin: 'auto' }} />
  else if (errorRegions || !regionsData) return <ErrorHandler refetch={refetchRegions} />

  const submit = () => {
    const validationResult = ApplicationForm.validate(state, { regions: regionsData.regions })
    if (validationResult.type === 'error') {
      enqueueSnackbar('Ungültige bzw. fehlende Eingaben entdeckt. Bitte prüfen Sie die rot markierten Felder.', {
        variant: 'error',
      })
      return
    }
    const [regionId, application] = validationResult.value

    addBlueEakApplication({
      variables: { regionId, application, project: projectId },
    })
  }

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
            loading={loadingSubmit}
            options={{ regions: regionsData.regions }}
          />
        )}
        <DialogActions>
          {loadingSubmit || formSubmitted ? null : <DiscardAllInputsButton discardAll={discardAll} />}
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
