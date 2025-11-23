import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { BlueCardMilitaryReserveEntitlementInput } from '../../../generated/graphql'
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

const SubForms = {
  certificate: FileInputForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardMilitaryReserveEntitlementInput
const MilitaryReserveEntitlementForm: Form<State, ValidatedInput> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
  Component: ({ state, setState }: FormComponentProps<State>) => {
    const { t } = useTranslation('applicationForms')
    return (
      <>
        <CustomDivider label={t('activityInformation')} />
        <Typography variant='body2bold' component='h4' marginY={1.5}>
          {t('certificateHeadline')}
        </Typography>
        <Typography component='p'>
          {t('certificateDescription')} {FileRequirementsText}
        </Typography>
        <FileInputForm.Component state={state.certificate} setState={useUpdateStateCallback(setState, 'certificate')} />
      </>
    )
  },
}

export default MilitaryReserveEntitlementForm
