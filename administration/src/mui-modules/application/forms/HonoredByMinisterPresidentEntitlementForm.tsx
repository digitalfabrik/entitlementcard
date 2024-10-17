import React from 'react'

import { GoldenCardHonoredByMinisterPresidentEntitlementInput } from '../../../generated/graphql'
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

const SubForms = { certificate: FileInputForm }

type State = CompoundState<typeof SubForms>
type ValidatedInput = GoldenCardHonoredByMinisterPresidentEntitlementInput
type Options = Record<string, unknown>
type AdditionalProps = Record<string, unknown>
const HonoredByMinisterPresidentEntitlementForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
  Component: ({ state, setState }: FormComponentProps<State, AdditionalProps, Options>) => (
    <>
      <CustomDivider label='Angaben zum Ehrenzeichen' />
      <h4>Urkunde</h4>
      <p>Hängen Sie hier bitte Ihre eingescannte oder abfotografierte Urkunde an. {FileRequirementsText}</p>
      <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
    </>
  ),
}

export default HonoredByMinisterPresidentEntitlementForm
