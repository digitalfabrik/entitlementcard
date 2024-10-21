import React from 'react'

import { BlueCardJuleicaEntitlementInput } from '../../../generated/graphql'
import CustomDivider from '../CustomDivider'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import DateForm from '../primitive-inputs/DateForm'
import FileInputForm, { FileRequirementsText, OptionalFileInputForm } from '../primitive-inputs/FileInputForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import { Form, FormComponentProps } from '../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../util/compoundFormUtils'

const SubForms = {
  juleicaNumber: ShortTextForm,
  juleicaExpirationDate: DateForm,
  copyOfJuleicaFront: FileInputForm,
  copyOfJuleicaBack: OptionalFileInputForm,
}
type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardJuleicaEntitlementInput
const JuleicaEntitlementForm: Form<State, ValidatedInput> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, { juleicaExpirationDate: { maximumDate: null } }),
  Component: ({ state, setState }: FormComponentProps<State>) => {
    const juleicaBackSetState = useUpdateStateCallback(setState, 'copyOfJuleicaBack')
    return (
      <>
        <CustomDivider label='Angaben zur JuLeiCa' />
        <ShortTextForm.Component
          label='Kartennummer'
          state={state.juleicaNumber}
          setState={useUpdateStateCallback(setState, 'juleicaNumber')}
        />
        <DateForm.Component
          label='Karte gültig bis'
          state={state.juleicaExpirationDate}
          setState={useUpdateStateCallback(setState, 'juleicaExpirationDate')}
          options={{ maximumDate: null }}
        />
        <h4>Kopie der JuLeiCa</h4>
        <p>Hängen Sie hier bitte Ihre eingescannte oder abfotografierte JuLeiCa an. {FileRequirementsText}</p>
        <SubForms.copyOfJuleicaFront.Component
          state={state.copyOfJuleicaFront}
          setState={useUpdateStateCallback(setState, 'copyOfJuleicaFront')}
        />
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions */}
        {(state.copyOfJuleicaFront || (!state.copyOfJuleicaFront && state.copyOfJuleicaBack)) && (
          <SubForms.copyOfJuleicaBack.Component state={state.copyOfJuleicaBack} setState={juleicaBackSetState} />
        )}
      </>
    )
  },
}

export default JuleicaEntitlementForm
