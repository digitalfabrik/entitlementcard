/* eslint-disable react/jsx-pascal-case  -- we cannot change the keys of application namespace, see translation file comment */
import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import CustomDivider from '../../../../components/CustomDivider'
import { BlueCardJuleicaEntitlementInput } from '../../../../generated/graphql'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import { Form, FormComponentProps } from '../../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import DateForm from '../primitive-inputs/DateForm'
import FileInputForm, {
  FileRequirementsText,
  OptionalFileInputForm,
} from '../primitive-inputs/FileInputForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'

const SubForms = {
  juleicaNumber: ShortTextForm,
  juleicaExpirationDate: DateForm,
  copyOfJuleicaFront: FileInputForm,
  copyOfJuleicaBack: OptionalFileInputForm,
}
type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardJuleicaEntitlementInput
const JuleicaEntitlementForm: Form<State, ValidatedInput> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, { juleicaExpirationDate: { maximumDate: undefined } }),
  Component: ({ state, setState }: FormComponentProps<State>) => {
    const { t } = useTranslation('application')
    const juleicaBackSetState = useUpdateStateCallback(setState, 'copyOfJuleicaBack')
    return (
      <>
        <CustomDivider label='Angaben zur JuLeiCa' />
        <ShortTextForm.Component
          label={t('juleicaNumber')}
          state={state.juleicaNumber}
          setState={useUpdateStateCallback(setState, 'juleicaNumber')}
        />
        <DateForm.Component
          label={t('juleicaExpiration')}
          state={state.juleicaExpirationDate}
          setState={useUpdateStateCallback(setState, 'juleicaExpirationDate')}
          options={{ maximumDate: undefined }}
        />
        <Typography variant='body2bold' component='h4' marginY={1.5}>
          {t('applicationForms:juleicaCardAttachmentTitle')}
        </Typography>
        <Typography component='p'>
          {t('applicationForms:juleicaCardAttachmentDescription')} {FileRequirementsText}
        </Typography>
        <SubForms.copyOfJuleicaFront.Component
          state={state.copyOfJuleicaFront}
          setState={useUpdateStateCallback(setState, 'copyOfJuleicaFront')}
        />
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions */}
        {(state.copyOfJuleicaFront || (!state.copyOfJuleicaFront && state.copyOfJuleicaBack)) && (
          <SubForms.copyOfJuleicaBack.Component
            state={state.copyOfJuleicaBack}
            setState={juleicaBackSetState}
          />
        )}
      </>
    )
  },
}

export default JuleicaEntitlementForm
