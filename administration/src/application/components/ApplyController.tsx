import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { useAddBlueEakApplicationMutation } from '../../generated/graphql'
import { DialogActions } from '@mui/material'
import useLocallyStoredState from '../useLocallyStoredState'
import DiscardAllInputsButton from './DiscardAllInputsButton'
import { useGarbageCollectArrayBuffers, useInitializeGlobalArrayBuffersManager } from '../globalArrayBuffersManager'
import ApplicationForm from './forms/ApplicationForm'
import { useCallback, useMemo } from 'react'
import { SnackbarProvider, useSnackbar } from 'notistack'

const applicationStorageKey = 'applicationState'

const ApplyController = () => {
  const [addBlueEakApplication] = useAddBlueEakApplicationMutation()
  const [state, setState] = useLocallyStoredState(ApplicationForm.initialState, applicationStorageKey)
  const arrayBufferManagerInitialized = useInitializeGlobalArrayBuffersManager()
  const getArrayBufferKeys = useMemo(
    () => (state === null ? null : () => ApplicationForm.getArrayBufferKeys(state)),
    [state]
  )
  const { enqueueSnackbar } = useSnackbar()
  useGarbageCollectArrayBuffers(getArrayBufferKeys)

  const discardAll = useCallback(() => setState(() => ApplicationForm.initialState), [setState])

  // state is null, if it's still being loaded from storage (e.g. after a page reload)
  if (state == null || !arrayBufferManagerInitialized) {
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
        <ApplicationForm.Component state={state} setState={setState} onSubmit={submit} />
        <DialogActions>
          <DiscardAllInputsButton discardAll={discardAll} />
        </DialogActions>
      </div>
    </div>
  )
}

const ApplyApp = () => (
  <SnackbarProvider>
    <ApplyController />
  </SnackbarProvider>
)

export default ApplyApp
