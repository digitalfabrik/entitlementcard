import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import CheckboxForm, { CheckboxFormState } from '../primitive-inputs/CheckboxForm'
import { Button } from '@mui/material'
import styled from 'styled-components'
import BasicDialog from "../BasicDialog";
import { useState } from 'react'
import {dataPrivacyBaseHeadline, dataPrivacyBaseText} from "../../../constants/dataPrivacyBase";

const PrivacyPolicyButton = styled(Button)`
  text-transform: capitalize !important;
  padding: 0 !important;
  vertical-align: unset !important;
`

const PrivacyPolicyContainer = styled.div`
align-self: center;
`

const acceptedDatePrivacyOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: 'Um den Antrag zu senden, müssen Sie der Datenschutzverarbeitung zustimmen.',
}
const givenInformationIsCorrectAndCompleteOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: 'Diese Erklärung ist erforderlich.',
}

export type StepSendFormState = {
  acceptedDataPrivacy: CheckboxFormState
  givenInformationIsCorrectAndComplete: CheckboxFormState
}
type ValidatedInput = {
  hasAcceptedDataPrivacy: boolean
  givenInformationIsCorrectAndComplete: boolean
}
type Options = {}
type AdditionalProps = { privacyPolicy:string }
const StepSendForm: Form<StepSendFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: {
    acceptedDataPrivacy: CheckboxForm.initialState,
    givenInformationIsCorrectAndComplete: CheckboxForm.initialState,
  },
  getArrayBufferKeys: state => [
    ...CheckboxForm.getArrayBufferKeys(state.acceptedDataPrivacy),
    ...CheckboxForm.getArrayBufferKeys(state.givenInformationIsCorrectAndComplete),
  ],
  getValidatedInput: state => {
    const hasAcceptedDataPrivacy = CheckboxForm.getValidatedInput(state.acceptedDataPrivacy, acceptedDatePrivacyOptions)
    const givenInformationIsCorrectAndComplete = CheckboxForm.getValidatedInput(
      state.givenInformationIsCorrectAndComplete,
      givenInformationIsCorrectAndCompleteOptions
    )
    if (hasAcceptedDataPrivacy.type === 'error' || givenInformationIsCorrectAndComplete.type === 'error')
      return { type: 'error' }
    return {
      type: 'valid',
      value: {
        hasAcceptedDataPrivacy: hasAcceptedDataPrivacy.value,
        givenInformationIsCorrectAndComplete: givenInformationIsCorrectAndComplete.value,
      },
    }
  },
  Component: ({ state, setState, privacyPolicy }) => {
      const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState<boolean>(false);
      const PrivacyLabel = (
          <PrivacyPolicyContainer>
              Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung
              gespeichert werden und akzeptiere die{' '}
              <PrivacyPolicyButton
                  variant='text'
                  onClick={() => setOpenPrivacyPolicy(true)
                  }>
                  Datenschutzerklärung
              </PrivacyPolicyButton>
          </PrivacyPolicyContainer>
      )
      return(
          <>
              <CheckboxForm.Component
                  state={state.acceptedDataPrivacy}
                  setState={useUpdateStateCallback(setState, 'acceptedDataPrivacy')}
                  options={acceptedDatePrivacyOptions}
                  label={PrivacyLabel}
              />

              <CheckboxForm.Component
                  label='Ich versichere, dass alle angegebenen Informationen korrekt und vollständig sind.'
                  state={state.givenInformationIsCorrectAndComplete}
                  setState={useUpdateStateCallback(setState, 'givenInformationIsCorrectAndComplete')}
                  options={givenInformationIsCorrectAndCompleteOptions}
              />
              <BasicDialog
                  open={openPrivacyPolicy}
                  maxWidth='lg'
                  onUpdateOpen={()=>setOpenPrivacyPolicy(false)}
                  title={dataPrivacyBaseHeadline}
                  content={`${dataPrivacyBaseText}\n${privacyPolicy}`}
              />
          </>
      )
  },
}

export default StepSendForm
