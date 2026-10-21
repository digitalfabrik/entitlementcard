/* eslint-disable react/jsx-pascal-case -- we cannot change the keys of application namespace, see translation file comment */
import { Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import CustomDivider from '../../../../components/CustomDivider'
import { CompensationType, WorkAtOrganizationInput } from '../../../../graphql'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps } from '../../util/formType'
import DateForm from '../primitive-inputs/DateForm'
import { FileRequirementsText, OptionalFileInputForm } from '../primitive-inputs/FileInputForm'
import NumberForm from '../primitive-inputs/NumberForm'
import SelectForm from '../primitive-inputs/SelectForm'
import ShortTextForm from '../primitive-inputs/ShortTextForm'
import OrganizationForm from './OrganizationForm'

const ActivityDivider = ({ onDelete }: { onDelete?: () => void }) => {
  const { t } = useTranslation('applicationForms')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  return (
    <>
      <CustomDivider
        label={t('workAtOrganization')}
        onDelete={onDelete === undefined ? undefined : () => setDeleteDialogOpen(true)}
      />
      {onDelete === undefined ? null : (
        <ConfirmDialog
          open={deleteDialogOpen}
          maxWidth='xs'
          onClose={() => setDeleteDialogOpen(false)}
          confirmButtonText={t('misc:delete')}
          onConfirm={onDelete}
          title={t('deleteActivityTitle')}
        >
          <Typography> {t('deleteActivityContent')}</Typography>
        </ConfirmDialog>
      )}
    </>
  )
}

const amountOfWorkOptions = { min: 0, max: 100 }
const compensationAmountOptions = { min: 0, max: 10000 }

const compensationTypeOptions = {
  items: [
    { value: CompensationType.None, label: 'compensationTypeNone' },
    { value: CompensationType.VolunteerAllowance, label: 'compensationTypeVolunteerAllowance' },
    { value: CompensationType.TrainerAllowance, label: 'compensationTypeTrainerAllowance' },
  ],
}

const isCompensationAmountRequired = (compensationType: string): boolean =>
  compensationType !== '' && compensationType !== CompensationType.None

const RequiredSubForms = {
  organization: OrganizationForm,
  amountOfWork: NumberForm,
  workSinceDate: DateForm,
  compensationType: SelectForm,
  responsibility: ShortTextForm,
  certificate: OptionalFileInputForm,
}

const SubForms = {
  ...RequiredSubForms,
  compensationAmount: NumberForm,
}

type State = CompoundState<typeof SubForms>
type AdditionalProps = { onDelete?: () => void; applicantName: string }

const WorkAtOrganizationForm: Form<State, WorkAtOrganizationInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: state => {
    const result = createCompoundValidate(RequiredSubForms, {
      amountOfWork: amountOfWorkOptions,
      compensationType: compensationTypeOptions,
      workSinceDate: { maximumDate: undefined },
    })(state)
    const compensationAmountResult = isCompensationAmountRequired(
      state.compensationType.selectedValue,
    )
      ? NumberForm.validate(state.compensationAmount, compensationAmountOptions)
      : { type: 'valid' as const, value: null }

    if (result.type === 'error' || compensationAmountResult.type === 'error') {
      return { type: 'error' }
    }
    return {
      type: 'valid',
      value: {
        ...result.value,
        compensationType: result.value.compensationType.shortText as CompensationType,
        compensationAmount: compensationAmountResult.value,
        isAlreadyVerified: null,
      },
    }
  },
  Component: ({
    state,
    setState,
    onDelete,
    applicantName,
  }: FormComponentProps<State, AdditionalProps>) => {
    const { t } = useTranslation('application')
    const setCompensationAmount = useUpdateStateCallback(setState, 'compensationAmount')

    return (
      <>
        <ActivityDivider onDelete={onDelete} />
        <Typography variant='body2bold' component='h4' sx={{ marginY: 1.5 }}>
          {t('applicationForms:workAtOrganizationHeadline')}
        </Typography>
        <SubForms.responsibility.Component
          state={state.responsibility}
          setState={useUpdateStateCallback(setState, 'responsibility')}
          label={t('applicationForms:workAtOrganization')}
        />
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div style={{ flex: '2' }}>
            <SubForms.workSinceDate.Component
              label={t('workSinceDate')}
              state={state.workSinceDate}
              setState={useUpdateStateCallback(setState, 'workSinceDate')}
              options={{ maximumDate: undefined }}
            />
          </div>
          <div style={{ flex: '3' }}>
            <SubForms.amountOfWork.Component
              label={t('amountOfWork')}
              state={state.amountOfWork}
              setState={useUpdateStateCallback(setState, 'amountOfWork')}
              options={amountOfWorkOptions}
              minWidth={250}
            />
          </div>
        </div>
        <SubForms.compensationType.Component
          state={state.compensationType}
          setState={useUpdateStateCallback(setState, 'compensationType')}
          label={t('compensationType')}
          options={{
            items: compensationTypeOptions.items.map(item => ({ ...item, label: t(item.label) })),
          }}
        />
        {isCompensationAmountRequired(state.compensationType.selectedValue) && (
          <SubForms.compensationAmount.Component
            label={t('compensationAmount')}
            state={state.compensationAmount}
            setState={setCompensationAmount}
            options={compensationAmountOptions}
          />
        )}
        <SubForms.organization.Component
          state={state.organization}
          setState={useUpdateStateCallback(setState, 'organization')}
          applicantName={applicantName}
        />
        <Typography variant='body2bold' component='h4' sx={{ marginY: 1.5 }}>
          {t('applicationForms:certificateHeadline')}
        </Typography>
        <Typography component='p'>
          {t('applicationForms:certificateDescription')} {FileRequirementsText}
        </Typography>
        <SubForms.certificate.Component
          state={state.certificate}
          setState={useUpdateStateCallback(setState, 'certificate')}
        />
      </>
    )
  },
}

export default WorkAtOrganizationForm
