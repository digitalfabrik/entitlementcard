import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { LoadingButton } from '@mui/lab'
import SendIcon from '@mui/icons-material/Send'

import { useAddBlueEakApplicationMutation } from '../../generated/graphql'
import { DialogActions } from '@mui/material'
import useLocallyStoredState from '../useLocallyStoredState'
import DiscardAllInputsButton from './DiscardAllInputsButton'
import { useGarbageCollectArrayBuffers, useInitializeGlobalArrayBuffersManager } from '../globalArrayBuffersManager'
import applicationForm from './forms/ApplicationForm'
import { useMemo } from 'react'

const applicationStorageKey = 'applicationState'

const ApplyController = () => {
  const [addBlueEakApplication, { loading }] = useAddBlueEakApplicationMutation()
  const [state, setState] = useLocallyStoredState(applicationForm.initialState, applicationStorageKey)
  const arrayBufferManagerInitialized = useInitializeGlobalArrayBuffersManager()
  const getArrayBufferKeys = useMemo(
    () => (state === null ? null : () => applicationForm.getArrayBufferKeys(state)),
    [state]
  )
  useGarbageCollectArrayBuffers(getArrayBufferKeys)
  // state is null, if it's still being loaded from storage (e.g. after a page reload)
  if (state == null || !arrayBufferManagerInitialized) {
    return null
  }

  const submit = () => {
    const application = applicationForm.getValidatedInput(state)
    if (application.type === 'error') {
      alert('Ungültige bzw. fehlende Eingaben entdeckt. Bitte prüfen Sie die rot markierten Felder.')
      return
    }

    const regionId = 1 // TODO: Add a mechanism to retrieve the regionId

    addBlueEakApplication({
      variables: {
        regionId, // TODO: Add a mechanism to retrieve the regionId
        application: application.value,
      },
    })
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', margin: '16px' }}>
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Blaue Ehrenamtskarte beantragen</h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            submit()
          }}>
          <applicationForm.Component state={state} setState={setState} />
          <DialogActions>
            <DiscardAllInputsButton discardAll={() => setState(() => applicationForm.initialState)} />
            <LoadingButton endIcon={<SendIcon />} variant='contained' type='submit' loading={loading}>
              Antrag Senden
            </LoadingButton>
          </DialogActions>
        </form>
      </div>
    </div>
  )
}
export default ApplyController
