import { BlueCardEntitlementInput, BlueCardEntitlementType } from '../../../generated/graphql'
import { SetState, useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import SwitchComponent from '../SwitchComponent'
import StandardEntitlementForm, { StandardEntitlementFormState } from './StandardEntitlementForm'

const BlueCardEntitlementTypeForm = ({
  state,
  setState,
}: {
  state: BlueCardEntitlementType | null
  setState: SetState<BlueCardEntitlementType | null>
}) => {
  return (
    <FormControl>
      <FormLabel>
        Die folgende Voraussetzung für die Beantragung einer blauen Ehrenamtskarte trifft auch mich zu:
      </FormLabel>
      <RadioGroup
        sx={{ '& > label': { marginTop: '4px', marginBottom: '4px' } }}
        value={state}
        onChange={e => setState(() => e.target.value as BlueCardEntitlementType)}>
        <FormControlLabel
          value={BlueCardEntitlementType.Standard}
          label='Ich engagiere mich ehrenamtlich seit mindestens zwei Jahren freiwillig mindestens fünf Stunden pro Woche oder bei Projektarbeiten mindestens 250 Stunden jährlich.'
          control={<Radio required />}
        />
        <Divider variant='middle' />
        <FormControlLabel
          value={BlueCardEntitlementType.Juleica}
          label='Ich bin Inhaber:in einer JuLeiCa (Jugendleitercarte)'
          control={<Radio required />}
        />
        <Divider variant='middle' />
        <FormControlLabel
          value={BlueCardEntitlementType.Service}
          label='Ich bin aktiv in der Freiwilligen Feuerwehr mit abgeschlossener Truppmannausbildung bzw. abgeschlossenem Basis-Modul der Modularen Truppausbildung (MTA), oder im Katastrophenschutz oder im Rettungsdienst mit abgeschlossener Grundausbildung.'
          control={<Radio required />}
        />
        {/* TODO: Add missing possible entitlements */}
      </RadioGroup>
    </FormControl>
  )
}

export type BlueCardEntitlementFormState = {
  entitlementType: BlueCardEntitlementType | null
  standardEntitlement: StandardEntitlementFormState
}
type ValidatedInput = BlueCardEntitlementInput
type Options = {}
type AdditionalProps = {}
const BlueCardEntitlementForm: Form<BlueCardEntitlementFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    entitlementType: null,
    standardEntitlement: StandardEntitlementForm.initialState,
  },
  getArrayBufferKeys: state => [...StandardEntitlementForm.getArrayBufferKeys(state.standardEntitlement)],
  getValidatedInput: state => {
    switch (state.entitlementType) {
      case BlueCardEntitlementType.Standard: {
        const standardEntitlement = StandardEntitlementForm.getValidatedInput(state.standardEntitlement)
        if (standardEntitlement.type === 'error') return { type: 'error' }
        return {
          type: 'valid',
          value: {
            entitlementType: state.entitlementType,
            workAtOrganizations: standardEntitlement.value,
          },
        }
      }
      default:
        return { type: 'error' }
    }
  },
  Component: ({ state, setState }) => (
    <>
      <BlueCardEntitlementTypeForm
        state={state.entitlementType}
        setState={useUpdateStateCallback(setState, 'entitlementType')}
      />
      <SwitchComponent value={state.entitlementType}>
        {{
          [BlueCardEntitlementType.Standard]: (
            <StandardEntitlementForm.Component
              state={state.standardEntitlement}
              setState={useUpdateStateCallback(setState, 'standardEntitlement')}
            />
          ),
          [BlueCardEntitlementType.Juleica]: null,
          [BlueCardEntitlementType.Service]: null,
        }}
      </SwitchComponent>
    </>
  ),
}

export default BlueCardEntitlementForm
