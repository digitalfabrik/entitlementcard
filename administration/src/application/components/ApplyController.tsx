import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { LoadingButton } from '@mui/lab'
import SendIcon from '@mui/icons-material/Send'

import {
  ApplicationType,
  BlueCardEntitlementInput,
  BlueCardEntitlementType,
  useAddBlueEakApplicationMutation,
} from '../../generated/graphql'
import { convertStandardEntitlementFormStateToInput } from './forms/StandardEntitlementForm'
import { DialogActions } from '@mui/material'
import { convertPersonalDataFormStateToInput } from './forms/PersonalDataForm'
import useLocallyStoredState from '../useLocallyStoredState'
import DiscardAllInputsButton from './DiscardAllInputsButton'
import { useInitializeGlobalArrayBuffersManager } from '../globalArrayBuffersManager'
import { ApplicationForm, initialApplicationFormState } from './forms/ApplicationForm'

const applicationStorageKey = 'applicationState'

const ApplyController = () => {
  const [addBlueEakApplication, { loading }] = useAddBlueEakApplicationMutation()
  const [state, setState] = useLocallyStoredState(initialApplicationFormState, applicationStorageKey)
  const arrayBufferManagerInitialized = useInitializeGlobalArrayBuffersManager()

  // state is null, if it's still being loaded from storage (e.g. after a page reload)
  if (state == null || !arrayBufferManagerInitialized) {
    return null
  }

  const getEntitlement = (): BlueCardEntitlementInput => {
    if (state.entitlementType === null) throw Error('EntitlementType is null.')
    switch (state.entitlementType) {
      case BlueCardEntitlementType.Standard:
        const workAtOrganizations = convertStandardEntitlementFormStateToInput(state.standardEntitlement)
        return {
          entitlementType: state.entitlementType,
          workAtOrganizations,
        }
      default:
        throw Error('Not yet implemented.')
    }
  }

  const submit = () => {
    const entitlement = getEntitlement()
    addBlueEakApplication({
      variables: {
        regionId: 1, // TODO: Add a mechanism to retrieve the regionId
        application: {
          entitlement,
          personalData: convertPersonalDataFormStateToInput(state.personalData),
          hasAcceptedPrivacyPolicy: true, // TODO: Add a corresponding field
          applicationType: ApplicationType.FirstApplication, // TODO: Add a corresponding field
          givenInformationIsCorrectAndComplete: true, // TODO: Add a corresponding field
        },
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
          <ApplicationForm state={state} setState={setState} />
          <DialogActions>
            <DiscardAllInputsButton discardAll={() => setState(() => initialApplicationFormState)} />
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
