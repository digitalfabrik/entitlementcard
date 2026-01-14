/* eslint-disable react/jsx-pascal-case  -- we cannot change the keys of application namespace, see translation file comment */
import { Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '../../../../components/ConfirmDialog'
import CustomDivider from '../../../../components/CustomDivider'
import { WorkAtOrganizationInput } from '../../../../generated/graphql'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps } from '../../util/formType'
import CheckboxForm from '../primitive-inputs/CheckboxForm'
import DateForm from '../primitive-inputs/DateForm'
import { FileRequirementsText, OptionalFileInputForm } from '../primitive-inputs/FileInputForm'
import NumberForm from '../primitive-inputs/NumberForm'
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
          id='delete-activity-dialog'
          open={deleteDialogOpen}
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
const paymentOptions = { required: false } as const

const SubForms = {
  organization: OrganizationForm,
  amountOfWork: NumberForm,
  workSinceDate: DateForm,
  payment: CheckboxForm,
  responsibility: ShortTextForm,
  certificate: OptionalFileInputForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = WorkAtOrganizationInput
type AdditionalProps = { onDelete?: () => void; applicantName: string }
const WorkAtOrganizationForm: Form<State, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {
    amountOfWork: amountOfWorkOptions,
    payment: paymentOptions,
    workSinceDate: { maximumDate: undefined },
  }),
  Component: ({
    state,
    setState,
    onDelete,
    applicantName,
  }: FormComponentProps<State, AdditionalProps>) => {
    const { t } = useTranslation('application')
    return (
      <>
        <ActivityDivider onDelete={onDelete} />
        <Typography variant='body2bold' component='h4' marginY={1.5}>
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
        <SubForms.organization.Component
          state={state.organization}
          setState={useUpdateStateCallback(setState, 'organization')}
          applicantName={applicantName}
        />
        <SubForms.payment.Component
          state={state.payment}
          setState={useUpdateStateCallback(setState, 'payment')}
          label={t('payment')}
          options={paymentOptions}
        />
        <Typography variant='body2bold' component='h4' marginY={1.5}>
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
