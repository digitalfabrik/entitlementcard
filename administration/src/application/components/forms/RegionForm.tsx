import { Region, useGetRegionByPostalCodeQuery } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import { CompoundState, createCompoundGetArrayBufferKeys, createCompoundInitialState } from '../../compoundFormUtils'
import SelectForm, { SelectItem } from '../primitive-inputs/SelectForm'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { useContext } from 'react'
import { useSnackbar } from 'notistack'

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
    const projectId = useContext(ProjectConfigContext).projectId
    const { enqueueSnackbar } = useSnackbar()
    const {} = useGetRegionByPostalCodeQuery({
      onError: () => {
        enqueueSnackbar('Region konnte nicht ermittelt werden. Bitte wählen sie ihre Region manuell aus.', {
          variant: 'warning',
        })
      },
      onCompleted: result => {
        if (result.region) {
          const { name, prefix, id } = result.region
          enqueueSnackbar(`${getOptionsLabel(prefix, name)} wurde als ihre Region ermittelt.`, {
            variant: 'success',
          })
          setState(() => ({ region: { selectedValue: id.toString() } }))
        }
      },
      variables: { postalCode: postalCode, projectId: projectId },
      skip: postalCode.length !== 5,
    })

    return (
      <SubForms.region.Component
        state={state.region}
        setState={useUpdateStateCallback(setState, 'region')}
        label='Empfänger des Antrags'
        options={{ items: getOptions(options.regions) }}
      />
    )
  },
}

export default RegionForm
