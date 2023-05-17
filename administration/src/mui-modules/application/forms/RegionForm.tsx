import { Alert, CircularProgress, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useContext, useEffect } from 'react'

import { Region, useGetRegionByPostalCodeQuery } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { useUpdateStateCallback } from '../hooks/useUpdateStateCallback'
import SelectForm, { SelectItem } from '../primitive-inputs/SelectForm'
import { Form } from '../util/FormType'
import { CompoundState, createCompoundGetArrayBufferKeys, createCompoundInitialState } from '../util/compoundFormUtils'

const StyledAlert = styled(Alert)`
  margin: 16px 0;
  transition: background-color 0.2s, color 0.2s;
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
  regions.map(region => {
    return { label: getOptionsLabel(region.prefix, region.name), value: region.id.toString() }
  })

const RegionForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: { ...createCompoundInitialState(SubForms), postalCodeUsedForAutoSelect: null },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: (state, options) => {
    const result = SubForms.region.validate(state.region, { items: getOptions(options.regions) })
    if (result.type === 'error') {
      return { type: 'error' }
    }
    return { type: 'valid', value: { regionId: Number(result.value.shortText) } }
  },
  Component: ({ state, setState, options, postalCode }) => {
    const setRegionState = useUpdateStateCallback(setState, 'region')
    const project = useContext(ProjectConfigContext).projectId
    const regionQuery = useGetRegionByPostalCodeQuery({
      onCompleted: result => {
        setState(prevState => {
          if (prevState.region.manuallySelected) return prevState
          return {
            region: { selectedValue: result.region.id.toString(), manuallySelected: false },
            postalCodeUsedForAutoSelect: postalCode,
          }
        })
      },
      variables: { postalCode, project },
      skip: postalCode.length !== 5 || state.region.manuallySelected,
    })

    // Clear auto-selected region when postal code changes
    useEffect(() => {
      if (state.region.manuallySelected && state.postalCodeUsedForAutoSelect !== null) {
        // Clear postalCodeUsedForAutoSelect, as the region was manually selected.
        setState(prevState => ({ ...prevState, postalCodeUsedForAutoSelect: null }))
      } else if (state.postalCodeUsedForAutoSelect !== null && postalCode !== state.postalCodeUsedForAutoSelect) {
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
          {`In der Regel müssen Sie die Ehrenamtskarte in dem Landkreis oder der kreisfreien Stadt Ihres Hauptwohnsitzes beantragen. Weitere Informationen können Sie `}
          <a
            href='https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/voraussetzungen/index.php'
            target='_blank'
            rel='noreferrer'>
            hier
          </a>
          {` einsehen.`}
          <br />
          {`Eine Liste der teilnehmenden Landkreise und kreisfreien Städte für den zentralen Beantragungsprozess finden Sie im Auswahlfeld unten.
          Alle anderen Regionen können Sie `}
          <a
            href='https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/voraussetzungen/index.php'
            target='_blank'
            rel='noreferrer'>
            hier
          </a>
          {` direkt kontaktieren, um Ihre Ehrenamtskarte zu erhalten.`}
        </Typography>
        {renderAlert(state, postalCode, regionQuery)}
        <SubForms.region.Component
          state={state.region}
          setState={setRegionState}
          label='Empfänger des Antrags'
          options={{ items: getOptions(options.regions) }}
        />
      </>
    )
  },
}

const renderAlert = (state: State, postalCode: string, query: ReturnType<typeof useGetRegionByPostalCodeQuery>) => {
  if (state.region.manuallySelected) return null
  else if (postalCode.length !== 5) {
    return (
      <StyledAlert severity='error'>
        Bitte geben Sie oben eine 5-stellige Postleitzahl an, sodass die zuständige Behörde automatisch ermittelt werden
        kann.
      </StyledAlert>
    )
  } else if (query.loading) {
    return <StyledAlert severity='info' icon={<CircularProgress size={'1em'} />}></StyledAlert>
  } else if (query.error) {
    return (
      <StyledAlert severity='warning'>
        Leider konnte die zuständige Behörde nicht automatisch anhand Ihrer Postleitzahl ermittelt werden. <br />
        Bitte nutzen Sie das folgende Auswahlfeld, um Ihre zuständige Behörde auszuwählen.
      </StyledAlert>
    )
  } else if (query.data) {
    return (
      <StyledAlert severity='success'>
        Die zuständige Behörde konnte anhand Ihrer Postleitzahl automatisch ermittelt werden.
      </StyledAlert>
    )
  }
  return null
}

export default RegionForm
