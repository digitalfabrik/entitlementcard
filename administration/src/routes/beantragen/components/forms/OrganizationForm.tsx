import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { OrganizationInput } from '../../../../graphql'
import i18next from '../../../../translations/i18n'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps } from '../../util/formType'
import SelectForm from '../primitive-inputs/SelectForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import AddressForm from './AddressForm'

const organizationCategoryOptions = {
  items: [
    'social',
    'animalWelfare',
    'sports',
    'education',
    'conservation',
    'culture',
    'health',
    'civilProtection',
    'church',
    'others',
  ].map(item => ({ label: i18next.t(`application:organization:${item}`), value: item })),
}

const SubForms = {
  name: ShortTextForm,
  address: AddressForm,
  category: SelectForm,
}

type State = CompoundState<typeof SubForms>

const OrganizationForm: Form<State, Omit<OrganizationInput, 'contact'>> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, { category: organizationCategoryOptions }),
  Component: ({ state, setState }: FormComponentProps<State>) => {
    const { t } = useTranslation('application')
    return (
      <>
        <Typography variant='body2bold' component='h4' sx={{ marginTop: 3, marginBottom: 1.5 }}>
          {t('organization.title')}
        </Typography>
        <ShortTextForm.Component
          state={state.name}
          setState={useUpdateStateCallback(setState, 'name')}
          label={t('organization.name')}
        />
        <AddressForm.Component
          state={state.address}
          setState={useUpdateStateCallback(setState, 'address')}
        />
        <SelectForm.Component
          state={state.category}
          setState={useUpdateStateCallback(setState, 'category')}
          label={t('organization.category')}
          options={organizationCategoryOptions}
        />
      </>
    )
  },
}

export default OrganizationForm
