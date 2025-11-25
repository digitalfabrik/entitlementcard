import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import CustomDivider from '../../../../components/CustomDivider'
import { GoldenCardHonoredByMinisterPresidentEntitlementInput } from '../../../../generated/graphql'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import { Form, FormComponentProps } from '../../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import FileInputForm, { FileRequirementsText } from '../primitive-inputs/FileInputForm'

const SubForms = { certificate: FileInputForm }

type State = CompoundState<typeof SubForms>
type ValidatedInput = GoldenCardHonoredByMinisterPresidentEntitlementInput
type Options = Record<string, unknown>
type AdditionalProps = Record<string, unknown>
const HonoredByMinisterPresidentEntitlementForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
  Component: ({ state, setState }: FormComponentProps<State, AdditionalProps, Options>) => {
    const { t } = useTranslation('applicationForms')
    return (
      <>
        <CustomDivider label={t('honoredByMinisterDivider')} />
        <Typography variant='body2bold' component='h4' marginY={1.5}>
          {t('honoredByMinisterCertificate')}
        </Typography>
        <Typography component='p'>
          {t('honoredByMinisterCertificateDescription')} {FileRequirementsText}
        </Typography>
        <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
      </>
    )
  },
}

export default HonoredByMinisterPresidentEntitlementForm
