/* eslint-disable react/jsx-pascal-case -- we cannot change the keys of application namespace, see translation file comment */
import { Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'

import AlertBox from '../../../../components/AlertBox'
import { OrganizationContactInput } from '../../../../graphql'
import { normalizeName } from '../../../../util/normalizeString'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps } from '../../util/formType'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import EmailForm from '../primitive-inputs/EmailForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'

const hasGivenPermissionOptions = {
  required: true,
  notCheckedErrorMessage: 'applicationForms:contactHasGivenPermissionNotCheckedError',
} as const

const SubForms = {
  name: ShortTextForm,
  email: EmailForm,
  telephone: ShortTextForm,
  hasGivenPermission: CheckboxForm,
}

type State = CompoundState<typeof SubForms>
type AdditionalProps = { applicantName: string }

const OrganizationContactForm: Form<State, OrganizationContactInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, { hasGivenPermission: hasGivenPermissionOptions }),
  Component: ({ state, setState, applicantName }: FormComponentProps<State, AdditionalProps>) => {
    const { t } = useTranslation('application')
    return (
      <>
        <Typography>{t('applicationForms:organizationContactPersonDescription')}</Typography>
        {normalizeName(applicantName) === normalizeName(state.name.shortText) && (
          <AlertBox
            fullWidth
            severity='warning'
            sx={{ margin: '8px 0' }}
            description={<Trans i18nKey='applicationForms:organizationContactPersonAlert' />}
          />
        )}
        <SubForms.name.Component
          state={state.name}
          setState={useUpdateStateCallback(setState, 'name')}
          label={t('organizationContact.name')}
        />
        <SubForms.email.Component
          state={state.email}
          setState={useUpdateStateCallback(setState, 'email')}
          label={t('organizationContact.email')}
        />
        <SubForms.telephone.Component
          state={state.telephone}
          setState={useUpdateStateCallback(setState, 'telephone')}
          label={t('organizationContact.telephone')}
        />
        <SubForms.hasGivenPermission.Component
          state={state.hasGivenPermission}
          setState={useUpdateStateCallback(setState, 'hasGivenPermission')}
          label={t('organizationContact.hasGivenPermission')}
          options={{
            ...hasGivenPermissionOptions,
            notCheckedErrorMessage: t(hasGivenPermissionOptions.notCheckedErrorMessage),
          }}
        />
      </>
    )
  },
}

export default OrganizationContactForm
