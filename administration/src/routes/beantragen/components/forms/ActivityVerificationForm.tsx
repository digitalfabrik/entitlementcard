/* eslint-disable react/jsx-pascal-case -- we cannot change the keys of application namespace, see translation file comment */
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { AttachmentInput, OrganizationContactInput } from '../../../../graphql'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createSwitchValidate,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps } from '../../util/formType'
import SwitchComponent from '../SwitchComponent'
import FileInputForm, { FileRequirementsText } from '../primitive-inputs/FileInputForm'
import { createRadioGroupForm } from '../primitive-inputs/RadioGroupForm'
import OrganizationContactForm from './OrganizationContactForm'

type VerificationType = 'contactPerson' | 'certificate'

const verificationTypeOptions: { labelByValue: { [K in VerificationType]: string } } = {
  labelByValue: {
    contactPerson: 'activityVerificationByContactPerson',
    certificate: 'activityVerificationByCertificate',
  },
}

const verificationTypeRadioGroupForm = createRadioGroupForm<VerificationType>()
const VerificationTypeRadioGroupForm: typeof verificationTypeRadioGroupForm = {
  ...verificationTypeRadioGroupForm,
  initialState: { selectedValue: 'contactPerson' },
}

const SubForms = {
  verificationType: VerificationTypeRadioGroupForm,
  contact: OrganizationContactForm,
  certificate: FileInputForm,
}

const validateSelected = createSwitchValidate(
  SubForms,
  { verificationType: verificationTypeOptions },
  'verificationType',
  { contactPerson: 'contact', certificate: 'certificate' },
)

type State = CompoundState<typeof SubForms>
type ValidatedInput = {
  contact: OrganizationContactInput | null
  certificate: AttachmentInput | null
}
type AdditionalProps = { applicantName: string }

/** An activity is either verified by a contact person of the organization or by an uploaded certificate. */
const ActivityVerificationForm: Form<State, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: state => {
    const result = validateSelected(state)
    return result.type === 'error'
      ? result
      : {
          type: 'valid',
          value: {
            contact: result.value.contact ?? null,
            certificate: result.value.certificate ?? null,
          },
        }
  },
  Component: ({ state, setState, applicantName }: FormComponentProps<State, AdditionalProps>) => {
    const { t } = useTranslation('applicationForms')
    return (
      <>
        <Typography variant='body2bold' component='h4' sx={{ marginTop: 3, marginBottom: 1.5 }}>
          {t('activityVerificationHeadline')}
        </Typography>
        <SubForms.verificationType.Component
          state={state.verificationType}
          setState={useUpdateStateCallback(setState, 'verificationType')}
          divideItems={false}
          title={t('activityVerificationTypeTitle')}
          options={{
            labelByValue: {
              contactPerson: t(verificationTypeOptions.labelByValue.contactPerson),
              certificate: t(verificationTypeOptions.labelByValue.certificate),
            },
          }}
        />
        <SwitchComponent value={state.verificationType.selectedValue}>
          {{
            contactPerson: (
              <SubForms.contact.Component
                state={state.contact}
                setState={useUpdateStateCallback(setState, 'contact')}
                applicantName={applicantName}
              />
            ),
            certificate: (
              <>
                <Typography component='p' sx={{ marginBottom: 1.5 }}>
                  {t('activityVerificationCertificateDescription')} {FileRequirementsText}
                </Typography>
                <SubForms.certificate.Component
                  state={state.certificate}
                  setState={useUpdateStateCallback(setState, 'certificate')}
                />
              </>
            ),
          }}
        </SwitchComponent>
      </>
    )
  },
}

export default ActivityVerificationForm
