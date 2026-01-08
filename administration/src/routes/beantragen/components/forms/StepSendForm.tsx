/* eslint-disable react/jsx-pascal-case  -- we cannot change the keys of application namespace, see translation file comment */
import { Close } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import React, { useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { useGetDataPolicyQuery } from '../../../../generated/graphql'
import { ProjectConfigContext } from '../../../../project-configs/ProjectConfigContext'
import i18next from '../../../../translations/i18n'
import getQueryResult from '../../../../util/getQueryResult'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import { Form, FormComponentProps } from '../../util/FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
  createCompoundValidate,
} from '../../util/compoundFormUtils'
import CheckboxForm from '../primitive-inputs/CheckboxForm'

const hasAcceptedDatePrivacyOptions: { required: boolean; notCheckedErrorMessage: string } = {
  required: true,
  notCheckedErrorMessage: i18next.t('applicationForms:uncheckedDataPrivacyError'),
}
const givenInformationIsCorrectAndCompleteOptions: {
  required: boolean
  notCheckedErrorMessage: string
} = {
  required: true,
  notCheckedErrorMessage: i18next.t('applicationForms:uncheckedCorrectAndCompleteError'),
}
const hasAcceptedEmailUsageOptions: { required: false } = {
  required: false,
}

const SubForms = {
  hasAcceptedDataPrivacy: CheckboxForm,
  givenInformationIsCorrectAndComplete: CheckboxForm,
  hasAcceptedEmailUsage: CheckboxForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = {
  hasAcceptedDataPrivacy: boolean
  givenInformationIsCorrectAndComplete: boolean
  hasAcceptedEmailUsage: boolean
}
type AdditionalProps = { regionId: string }

const StepSendForm: Form<State, ValidatedInput, AdditionalProps> = {
  initialState: createCompoundInitialState(SubForms),
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, {
    hasAcceptedDataPrivacy: hasAcceptedDatePrivacyOptions,
    givenInformationIsCorrectAndComplete: givenInformationIsCorrectAndCompleteOptions,
    hasAcceptedEmailUsage: hasAcceptedEmailUsageOptions,
  }),
  Component: ({ state, setState, regionId }: FormComponentProps<State, AdditionalProps>) => {
    const { t } = useTranslation('applicationForms')
    const setHasAcceptedDataPrivacyState = useUpdateStateCallback(
      setState,
      'hasAcceptedDataPrivacy',
    )
    const setGivenInformationIsCorrectAndComplete = useUpdateStateCallback(
      setState,
      'givenInformationIsCorrectAndComplete',
    )
    const setHasAcceptedEmailUsage = useUpdateStateCallback(setState, 'hasAcceptedEmailUsage')
    const policyQuery = useGetDataPolicyQuery({
      variables: { regionId: Number(regionId) },
      skip: regionId.length === 0 || Number.isNaN(regionId),
    })
    const config = useContext(ProjectConfigContext)
    const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState<boolean>(false)
    const PrivacyLabel = (
      <Typography component='span'>
        <Trans i18nKey='applicationForms:acceptDataPrivacyPolicy' />{' '}
        <Button
          variant='text'
          color='primary'
          sx={{ textTransform: 'capitalize', padding: 0, verticalAlign: 'unset' }}
          onClick={() => setOpenPrivacyPolicy(true)}
        >
          {t('acceptDataPrivacyButton')}
        </Button>
        .
      </Typography>
    )

    const policyQueryHandler = getQueryResult(policyQuery)
    if (!policyQueryHandler.successful) {
      return policyQueryHandler.component
    }
    const dataPrivacyPolicy = policyQueryHandler.data.dataPolicy.dataPrivacyPolicy

    return (
      <>
        <SubForms.hasAcceptedDataPrivacy.Component
          state={state.hasAcceptedDataPrivacy}
          setState={setHasAcceptedDataPrivacyState}
          options={hasAcceptedDatePrivacyOptions}
          label={PrivacyLabel}
        />
        <SubForms.hasAcceptedEmailUsage.Component
          label={t('acceptAdvertisement')}
          state={state.hasAcceptedEmailUsage}
          setState={setHasAcceptedEmailUsage}
          options={hasAcceptedEmailUsageOptions}
        />
        <SubForms.givenInformationIsCorrectAndComplete.Component
          label={t('acceptInputCorrectComplete')}
          state={state.givenInformationIsCorrectAndComplete}
          setState={setGivenInformationIsCorrectAndComplete}
          options={givenInformationIsCorrectAndCompleteOptions}
        />
        <Dialog
          open={openPrivacyPolicy}
          aria-describedby='data-privacy-dialog'
          fullWidth
          onClose={() => setOpenPrivacyPolicy(false)}
        >
          <DialogTitle>{config.dataPrivacyHeadline}</DialogTitle>
          <DialogContent id='data-privacy-dialog'>
            <>
              <config.dataPrivacyContent />
              {config.dataPrivacyAdditionalBaseContent &&
              (!dataPrivacyPolicy || dataPrivacyPolicy.length === 0) ? (
                <config.dataPrivacyAdditionalBaseContent />
              ) : (
                <Typography>{dataPrivacyPolicy}</Typography>
              )}
            </>
          </DialogContent>
          <DialogActions sx={{ paddingLeft: 3, paddingRight: 3, paddingBottom: 3 }}>
            <Button
              onClick={() => setOpenPrivacyPolicy(false)}
              variant='outlined'
              startIcon={<Close />}
            >
              {t('misc:close')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  },
}

export default StepSendForm
