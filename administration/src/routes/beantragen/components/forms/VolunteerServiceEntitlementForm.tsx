import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

import CustomDivider from '../../../../components/CustomDivider'
import { BlueCardVolunteerServiceEntitlementInput } from '../../../../generated/graphql'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps } from '../../util/formType'
import FileInputForm, { FileRequirementsText } from '../primitive-inputs/FileInputForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'

const SubForms = {
  programName: ShortTextForm,
  certificate: FileInputForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = BlueCardVolunteerServiceEntitlementInput
const VolunteerServiceEntitlementForm: Form<State, ValidatedInput> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {}),
  Component: ({ state, setState }: FormComponentProps<State>) => {
    const { t } = useTranslation('applicationForms')
    return (
      <>
        <CustomDivider label={t('activityInformation')} />
        <ShortTextForm.Component
          label={t('application:volunteerServiceEntitlement:programName')}
          state={state.programName}
          setState={useUpdateStateCallback(setState, 'programName')}
        />
        <Typography variant='body2bold' component='h4' marginY={1.5}>
          {t('application:volunteerServiceEntitlement:certificate')}
        </Typography>
        <Typography component='p'>
          {t('certificateDescription')} {FileRequirementsText}
        </Typography>
        <FileInputForm.Component
          state={state.certificate}
          setState={useUpdateStateCallback(setState, 'certificate')}
        />
      </>
    )
  },
}

export default VolunteerServiceEntitlementForm
