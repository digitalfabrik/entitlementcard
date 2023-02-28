import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../../compoundFormUtils'
import { Button, CircularProgress } from '@mui/material'
import BasicDialog from '../BasicDialog'
import { useContext, useState } from 'react'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { useGetDataPolicyQuery } from '../../../generated/graphql'
import { useSnackbar } from 'notistack'
import ErrorHandler from '../../../ErrorHandler'

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
type AdditionalProps = { regionId: number }
const StepSendForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {
    hasAcceptedDataPrivacy: hasAcceptedDatePrivacyOptions,
    givenInformationIsCorrectAndComplete: givenInformationIsCorrectAndCompleteOptions,
  }),
  Component: ({ state, setState, regionId }) => {
    const setHasAcceptedDataPrivacyState = useUpdateStateCallback(setState, 'hasAcceptedDataPrivacy')
    const setGivenInformationIsCorrectAndComplete = useUpdateStateCallback(
      setState,
      'givenInformationIsCorrectAndComplete'
    )
    const { enqueueSnackbar } = useSnackbar()
    const {
      loading: loadingPolicy,
      error: errorPolicy,
      data: policyData,
      refetch: refetchPolicy,
    } = useGetDataPolicyQuery({
      variables: { regionId: regionId },
      onError: () => enqueueSnackbar('Datenschutzerklärung konnte nicht geladen werden', { variant: 'error' }),
    })
    const config = useContext(ProjectConfigContext)
    const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState<boolean>(false)
    const PrivacyLabel = (
      <span>
        Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung gespeichert werden und
        akzeptiere die{' '}
        <Button
          variant='text'
          style={{ textTransform: 'capitalize', padding: 0, verticalAlign: 'unset' }}
          onClick={() => setOpenPrivacyPolicy(true)}>
          Datenschutzerklärung
        </Button>
        .
      </span>
    )

    if (loadingPolicy) return <CircularProgress />
    if (errorPolicy || !policyData) return <ErrorHandler refetch={refetchPolicy} />

    return (
      <>
        <SubForms.hasAcceptedDataPrivacy.Component
          state={state.hasAcceptedDataPrivacy}
          setState={setHasAcceptedDataPrivacyState}
          options={hasAcceptedDatePrivacyOptions}
          label={PrivacyLabel}
        />
        <SubForms.givenInformationIsCorrectAndComplete.Component
          label='Ich versichere, dass alle angegebenen Informationen korrekt und vollständig sind.'
          state={state.givenInformationIsCorrectAndComplete}
          setState={setGivenInformationIsCorrectAndComplete}
          options={givenInformationIsCorrectAndCompleteOptions}
        />
        <BasicDialog
          open={openPrivacyPolicy}
          maxWidth='lg'
          onUpdateOpen={setOpenPrivacyPolicy}
          title={config.dataPrivacyHeadline}
          content={
            <>
              <config.dataPrivacyContent />
              <div>{policyData.dataPolicy.dataPrivacyPolicy}</div>
            </>
          }
        />
      </>
    )
  },
}

export default StepSendForm
