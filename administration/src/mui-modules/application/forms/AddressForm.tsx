import { useTranslation } from 'react-i18next'

import { AddressInput } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import ShortTextForm, { OptionalShortTextForm } from '../primitive-inputs/ShortTextForm'
import { Form, FormComponentProps } from '../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../util/compoundFormUtils'

const SubForms = {
  street: ShortTextForm,
  houseNumber: ShortTextForm,
  addressSupplement: OptionalShortTextForm,
  location: ShortTextForm,
  postalCode: ShortTextForm,
  country: ShortTextForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = AddressInput

const AddressForm: Form<State, ValidatedInput> = {
  initialState: { ...createCompoundInitialState(SubForms), country: { shortText: 'Deutschland' } },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
  Component: ({ state, setState }: FormComponentProps<State>) => {
    const { t } = useTranslation('application')
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div style={{ flex: '3' }}>
            <SubForms.street.Component
              state={state.street}
              setState={useUpdateStateCallback(setState, 'street')}
              label={t('street')}
            />
          </div>
          <div style={{ flex: '1' }}>
            <SubForms.houseNumber.Component
              state={state.houseNumber}
              setState={useUpdateStateCallback(setState, 'houseNumber')}
              label={t('houseNumber')}
              minWidth={100}
            />
          </div>
        </div>
        <SubForms.addressSupplement.Component
          label={t('addressSupplement')}
          state={state.addressSupplement}
          setState={useUpdateStateCallback(setState, 'addressSupplement')}
        />
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div style={{ flex: '1' }}>
            <SubForms.postalCode.Component
              state={state.postalCode}
              setState={useUpdateStateCallback(setState, 'postalCode')}
              label={t('postalCode')}
            />
          </div>
          <div style={{ flex: '3' }}>
            <SubForms.location.Component
              state={state.location}
              setState={useUpdateStateCallback(setState, 'location')}
              label={t('location')}
            />
          </div>
          <SubForms.country.Component
            state={state.country}
            setState={useUpdateStateCallback(setState, 'country')}
            label={t('country')}
          />
        </div>
      </>
    )
  },
}

export default AddressForm
