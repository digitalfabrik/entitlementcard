import { Button } from '@mui/material'
import React, { useContext, useState } from 'react'

import { useGetDataPolicyQuery } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import getQueryResult from '../../util/getQueryResult'
import BasicDialog from '../BasicDialog'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import { Form, FormComponentProps } from '../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../util/compoundFormUtils'

const hasAcceptedDatePrivacyOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: 'Um den Antrag zu senden, müssen Sie der Datenschutzverarbeitung zustimmen.',
}
const givenInformationIsCorrectAndCompleteOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: 'Diese Erklärung ist erforderlich.',
}
const hasAcceptedEmailUsageOptions: { required: false } = {
  required: false,
}

const SubForms = {
  hasAcceptedDataPrivacy: CheckboxForm,
  givenInformationIsCorrectAndComplete: CheckboxForm,
  hasAcceptedEmailUsage: CheckboxForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = {
  hasAcceptedDataPrivacy: boolean
  givenInformationIsCorrectAndComplete: boolean
  hasAcceptedEmailUsage: boolean
}
type AdditionalProps = { regionId: number }

const StepSendForm: Form<State, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {
    hasAcceptedDataPrivacy: hasAcceptedDatePrivacyOptions,
    givenInformationIsCorrectAndComplete: givenInformationIsCorrectAndCompleteOptions,
    hasAcceptedEmailUsage: hasAcceptedEmailUsageOptions,
  }),
  Component: ({ state, setState, regionId }: FormComponentProps<State, AdditionalProps>) => {
    const setHasAcceptedDataPrivacyState = useUpdateStateCallback(setState, 'hasAcceptedDataPrivacy')
    const setGivenInformationIsCorrectAndComplete = useUpdateStateCallback(
      setState,
      'givenInformationIsCorrectAndComplete'
    )
    const setHasAcceptedEmailUsage = useUpdateStateCallback(setState, 'hasAcceptedEmailUsage')
    const policyQuery = useGetDataPolicyQuery({ variables: { regionId } })
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

    const policyQueryHandler = getQueryResult(policyQuery)
    if (!policyQueryHandler.successful) {
      return policyQueryHandler.component
    }
    const dataPrivacyPolicy = policyQueryHandler.data.dataPolicy.dataPrivacyPolicy

    return (
      <>
        <SubForms.hasAcceptedDataPrivacy.Component
          state={state.hasAcceptedDataPrivacy}
          setState={setHasAcceptedDataPrivacyState}
          options={hasAcceptedDatePrivacyOptions}
          label={PrivacyLabel}
        />
        <SubForms.hasAcceptedEmailUsage.Component
          label='Ich stimme zu, dass ich von der lokalen Ehrenamtskoordination über Verlosungen und regionale Angebote informiert werden darf.'
          state={state.hasAcceptedEmailUsage}
          setState={setHasAcceptedEmailUsage}
          options={hasAcceptedEmailUsageOptions}
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
              {config.dataPrivacyAdditionalBaseContent && (!dataPrivacyPolicy || dataPrivacyPolicy.length === 0) ? (
                <config.dataPrivacyAdditionalBaseContent />
              ) : (
                dataPrivacyPolicy
              )}
            </>
          }
        />
      </>
    )
  },
}

export default StepSendForm
