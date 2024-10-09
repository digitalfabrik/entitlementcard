import React from 'react'

import { BlueCardMilitaryReserveEntitlementInput } from '../../../generated/graphql'
import CustomDivider from '../CustomDivider'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import FileInputForm, { FileRequirementsText } from '../primitive-inputs/FileInputForm'
import { Form, FormComponentProps } from '../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../util/compoundFormUtils'

const SubForms = {
  certificate: FileInputForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardMilitaryReserveEntitlementInput
const MilitaryReserveEntitlementForm: Form<State, ValidatedInput> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
  Component: ({ state, setState }: FormComponentProps<State>) => (
    <>
      <CustomDivider label='Angaben zur Tätigkeit' />
      <h4>Tätigkeitsnachweis</h4>
      <p>
        Hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. {FileRequirementsText}
      </p>
      <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
    </>
  ),
}

export default MilitaryReserveEntitlementForm
