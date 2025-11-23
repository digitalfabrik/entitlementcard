import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { GoldenCardHonoredByMinisterPresidentEntitlementInput } from '../../../generated/graphql'
import CustomDivider from '../CustomDivider'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import FileInputForm, { FileRequirementsText } from '../primitive-inputs/FileInputForm'
import { Form, FormComponentProps } from '../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../util/compoundFormUtils'

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
