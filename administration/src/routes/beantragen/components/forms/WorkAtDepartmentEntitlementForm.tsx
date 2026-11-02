/* eslint-disable react/jsx-pascal-case -- we cannot change the keys of application namespace, see translation file comment */
import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'

import CustomDivider from '../../../../components/CustomDivider'
import { BlueCardWorkAtDepartmentEntitlementInput } from '../../../../graphql'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps } from '../../util/formType'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import ActivityVerificationForm from './ActivityVerificationForm'
import OrganizationForm from './OrganizationForm'

const SubForms = {
  organization: OrganizationForm,
  responsibility: ShortTextForm,
  verification: ActivityVerificationForm,
}

type State = CompoundState<typeof SubForms>
type AdditionalProps = { applicantName: string }

const WorkAtDepartmentEntitlementForm: Form<
  State,
  BlueCardWorkAtDepartmentEntitlementInput,
  AdditionalProps
> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: state => {
    const result = createCompoundValidate(SubForms, {})(state)
    if (result.type === 'error') {
      return result
    }
    const { organization, verification, responsibility } = result.value
    return {
      type: 'valid',
      value: {
        responsibility,
        organization: { ...organization, contact: verification.contact },
        certificate: verification.certificate,
      },
    }
  },
  Component: ({ state, setState, applicantName }: FormComponentProps<State, AdditionalProps>) => {
    const { t } = useTranslation('applicationForms')
    return (
      <>
        <CustomDivider label={t('activityInformation')} />
        <Box sx={{ marginBottom: 1.5 }}>
          <SubForms.responsibility.Component
            label={t('activityFunction')}
            state={state.responsibility}
            setState={useUpdateStateCallback(setState, 'responsibility')}
          />
        </Box>
        <SubForms.organization.Component
          state={state.organization}
          setState={useUpdateStateCallback(setState, 'organization')}
        />
        <SubForms.verification.Component
          state={state.verification}
          setState={useUpdateStateCallback(setState, 'verification')}
          applicantName={applicantName}
        />
      </>
    )
  },
}

export default WorkAtDepartmentEntitlementForm
