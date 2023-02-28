import { Region, useGetRegionByPostalCodeQuery } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { CompoundState, createCompoundGetArrayBufferKeys, createCompoundInitialState } from '../../compoundFormUtils'
import SelectForm, { SelectItem } from '../primitive-inputs/SelectForm'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { useContext } from 'react'
import { Alert, CircularProgress, Typography } from '@mui/material'
import styled from 'styled-components'
import usePreviousProp from '../../../util/usePrevious'

const StyledAlert = styled(Alert)`
  margin: 16px 0;
`

const SubForms = {
  region: SelectForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = { regionId: number }
type Options = { regions: Region[] }
type AdditionalProps = { postalCode: string }

const getOptionsLabel = (prefix: string, name: string) => `${name} (${prefix})`

export const getOptions = (regions: Region[]): SelectItem[] =>
  regions.map(region => {
    return { label: getOptionsLabel(region.prefix, region.name), value: region.id.toString() }
  })

const RegionForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: { ...createCompoundInitialState(SubForms) },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: (state, options) => {
    const result = SubForms.region.validate(state.region, { items: getOptions(options.regions) })
    if (result.type === 'error') {
      return { type: 'error' }
    }
    return { type: 'valid', value: { regionId: Number(result.value.shortText) } }
  },
  Component: ({ state, setState, options, postalCode }) => {
    const previousPostalCode = usePreviousProp(postalCode)
    const setRegionState = useUpdateStateCallback(setState, 'region')
    const project = useContext(ProjectConfigContext).projectId
    const {
      loading: loadingRegion,
      error: errorRegion,
      data: dataRegion,
    } = useGetRegionByPostalCodeQuery({
      onCompleted: result => {
        if (!previousPostalCode || previousPostalCode === postalCode) {
          return
        }
        if (result.region && (state.region.autoSelected || previousPostalCode !== postalCode)) {
          const { id } = result.region
          setState(() => ({ region: { selectedValue: id.toString(), autoSelected: true } }))
        }
      },
      onError: () => {
        setState(() => ({ region: { selectedValue: '', autoSelected: false } }))
      },
      variables: { postalCode: postalCode, project: project },
      skip: postalCode.length !== 5,
    })

    if (loadingRegion) {
      return <CircularProgress />
    }

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
          Eine Liste der teilnehmenden Landkreise und kreisfreien Städte finden Sie Auswahlfeld.
        </Typography>
        {postalCode.length < 5 && (
          <StyledAlert severity='error'>
            Bitte geben Sie oben eine 5-stellige Postleitzahl an, sodass die zuständige Behörde automatisch ermittelt
            werden kann.
          </StyledAlert>
        )}
        {errorRegion && (
          <StyledAlert severity='warning'>
            Leider konnte die zuständige Behörde nicht automatisch anhand Ihrer Postleitzahl ermittelt werden. <br />
            Bitte nutzen Sie das folgende Auswahlfeld, um Ihre Region auszuwählen.
          </StyledAlert>
        )}
        {dataRegion && state.region.autoSelected && (
          <StyledAlert severity='success'>
            Die zuständige Behörde konnte anhand Ihrer Postleitzahl automatisch ermittelt werden.
          </StyledAlert>
        )}
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

export default RegionForm
