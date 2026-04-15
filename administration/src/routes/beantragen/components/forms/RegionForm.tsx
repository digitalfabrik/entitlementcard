/* eslint-disable react/jsx-pascal-case -- we cannot change the keys of application namespace, see translation file comment */
import { Alert, CircularProgress, Link, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { TFunction } from 'i18next'
import React, { useContext, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { UseQueryState, useQuery } from 'urql'

import {
  GetRegionsByPostalCodeDocument,
  GetRegionsByPostalCodeQuery,
  Region,
} from '../../../../graphql'
import { ProjectConfigContext } from '../../../../provider/ProjectConfigContext'
import { useUpdateStateCallback } from '../../hooks/useUpdateStateCallback'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundInitialState,
} from '../../util/compoundFormUtils'
import { Form, FormComponentProps } from '../../util/formType'
import SelectForm, { SelectItem } from '../primitive-inputs/SelectForm'

const StyledAlert = styled(Alert)`
  margin: 16px 0;
  transition:
    background-color 0.2s,
    color 0.2s;
`

const SubForms = {
  region: SelectForm,
}

type State = CompoundState<typeof SubForms> & { postalCodeUsedForAutoSelect: string | null }
type ValidatedInput = { regionId: number }
type Options = { regions: Region[] }
type AdditionalProps = { postalCode: string }

const getOptionsLabel = (prefix: string, name: string) => `${name} (${prefix})`

export const getOptions = (regions: Region[]): SelectItem[] =>
  regions.map(region => ({
    label: getOptionsLabel(region.prefix, region.name),
    value: region.id.toString(),
  }))

const renderAlert = (
  state: State,
  postalCode: string,
  queryState: UseQueryState<GetRegionsByPostalCodeQuery>,
  t: TFunction,
) => {
  if (state.region.manuallySelected) {
    return null
  }
  if (postalCode.length !== 5) {
    return <StyledAlert severity='error'>{t('regionAlertPostalCode')}</StyledAlert>
  }
  if (queryState.fetching) {
    return <StyledAlert severity='info' icon={<CircularProgress size='1em' />} />
  }
  if (queryState.error) {
    return (
      <StyledAlert severity='warning'>
        <Trans i18nKey='applicationForms:regionNotDetermined' />
      </StyledAlert>
    )
  }
  if (queryState.data && queryState.data.regions.length > 1) {
    const regions = queryState.data.regions
    return (
      <StyledAlert severity='warning'>
        <Trans i18nKey='applicationForms:regionNotUnique' />
        <Typography component='ul' marginX={0.5}>
          {regions.map(region => {
            const displayName = `${region.name} (${region.prefix})`
            return (
              <Typography component='li' key={displayName}>
                {displayName}
              </Typography>
            )
          })}
        </Typography>
      </StyledAlert>
    )
  }
  if (queryState.data) {
    return <StyledAlert severity='success'>{t('regionDetermined')}</StyledAlert>
  }
  return null
}

const RegionForm: Form<State, ValidatedInput, AdditionalProps, Options> = {
  initialState: { ...createCompoundInitialState(SubForms), postalCodeUsedForAutoSelect: null },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: (state, options) => {
    const result = SubForms.region.validate(state.region, { items: getOptions(options.regions) })
    if (result.type === 'error') {
      return { type: 'error' }
    }
    return { type: 'valid', value: { regionId: Number(result.value.shortText) } }
  },
  Component: ({
    state,
    setState,
    options,
    postalCode,
  }: FormComponentProps<State, AdditionalProps, Options>) => {
    const { t } = useTranslation('applicationForms')
    const setRegionState = useUpdateStateCallback(setState, 'region')
    const project = useContext(ProjectConfigContext).projectId
    const [regionQueryState] = useQuery({
      query: GetRegionsByPostalCodeDocument,
      variables: { postalCode, project },
      pause: postalCode.length !== 5 || state.region.manuallySelected,
    })

    // Auto-select region when query returns exactly one result
    useEffect(() => {
      if (regionQueryState.data?.regions.length === 1) {
        const region = regionQueryState.data.regions[0]
        setState(prevState => {
          if (prevState.region.manuallySelected) {
            return prevState
          }
          return {
            region: { selectedValue: region.id.toString(), manuallySelected: false },
            postalCodeUsedForAutoSelect: postalCode,
          }
        })
      }
    }, [regionQueryState.data, postalCode, setState])

    // Clear auto-selected region when postal code changes
    useEffect(() => {
      if (state.region.manuallySelected && state.postalCodeUsedForAutoSelect !== null) {
        // Clear postalCodeUsedForAutoSelect, as the region was manually selected.
        setState(prevState => ({ ...prevState, postalCodeUsedForAutoSelect: null }))
      } else if (
        state.postalCodeUsedForAutoSelect !== null &&
        postalCode !== state.postalCodeUsedForAutoSelect
      ) {
        // Clear the auto-selected region
        setState(() => ({
          region: { selectedValue: '', manuallySelected: false },
          postalCodeUsedForAutoSelect: null,
        }))
      }
    }, [setState, state.region.manuallySelected, state.postalCodeUsedForAutoSelect, postalCode])

    return (
      <>
        <Typography>
          {t('regionSelectionDescriptionStart')}
          <Link
            href='https://www.ehrenamt.bayern.de/vorteile-wettbewerbe/ehrenamtskarte/'
            target='_blank'
            rel='noreferrer'
          >
            {t('misc:clickHere')}
          </Link>{' '}
          {t('regionSelectionDescriptionEnd')}
          .
          <br />
          <Trans i18nKey='applicationForms:regionSelectionListTextStart' />{' '}
          <Link
            href='https://www.ehrenamt.bayern.de/vorteile-wettbewerbe/ehrenamtskarte/landkreise.php'
            target='_blank'
            rel='noreferrer'
          >
            {t('misc:clickHere')}
          </Link>{' '}
          {t('regionSelectionListTextEnd')}
        </Typography>
        {renderAlert(state, postalCode, regionQueryState, t)}
        <SubForms.region.Component
          state={state.region}
          setState={setRegionState}
          label={t('regionSelectionLabel')}
          options={{ items: getOptions(options.regions) }}
        />
      </>
    )
  },
}

export default RegionForm
