import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../../compoundFormUtils'
import { Button } from '@mui/material'
import BasicDialog from '../BasicDialog'
import { useContext, useState } from 'react'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'

const hasAcceptedDatePrivacyOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: 'Um den Antrag zu senden, müssen Sie der Datenschutzverarbeitung zustimmen.',
}
const givenInformationIsCorrectAndCompleteOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: 'Diese Erklärung ist erforderlich.',
}

const SubForms = {
  hasAcceptedDataPrivacy: CheckboxForm,
  givenInformationIsCorrectAndComplete: CheckboxForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = {
  hasAcceptedDataPrivacy: boolean
  givenInformationIsCorrectAndComplete: boolean
}
type Options = {}
type AdditionalProps = { privacyPolicy: string }
const StepSendForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {
    hasAcceptedDataPrivacy: hasAcceptedDatePrivacyOptions,
    givenInformationIsCorrectAndComplete: givenInformationIsCorrectAndCompleteOptions,
  }),
  Component: ({ state, setState, privacyPolicy }) => {
    const config = useContext(ProjectConfigContext)
    const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState<boolean>(false)
    const PrivacyLabel = (
      <div style={{ alignSelf: 'center' }}>
        Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung gespeichert werden und
        akzeptiere die{' '}
        <Button
          variant='text'
          style={{ textTransform: 'capitalize', padding: 0, verticalAlign: 'unset' }}
          onClick={() => setOpenPrivacyPolicy(true)}>
          Datenschutzerklärung
        </Button>
        .
      </div>
    )
    return (
      <>
        <CheckboxForm.Component
          state={state.hasAcceptedDataPrivacy}
          setState={useUpdateStateCallback(setState, 'hasAcceptedDataPrivacy')}
          options={hasAcceptedDatePrivacyOptions}
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
          onUpdateOpen={setOpenPrivacyPolicy}
          title={config.dataPrivacyHeadline}
          content={
            <>
              <config.dataPrivacyText />
              <div>{privacyPolicy}</div>
            </>
          }
        />
      </>
    )
  },
}

export default StepSendForm
