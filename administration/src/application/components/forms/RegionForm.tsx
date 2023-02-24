import { Region, ShortTextInput, useGetRegionByPostalCodeQuery } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../../compoundFormUtils'
import SelectForm, { SelectItem } from '../primitive-inputs/SelectForm'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import { useContext } from 'react'
import { useSnackbar } from 'notistack'

const SubForms = {
  region: SelectForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = { region: ShortTextInput }
type Options = {}
type AdditionalProps = { regionData: Region[]; postalCode: string }

const getOptionsLabel = (prefix: string, name: string) => `${name} (${prefix})`

const getOptions = (regions: Region[]): SelectItem[] =>
  regions.map(region => {
    return { label: getOptionsLabel(region.prefix, region.name), value: region.id.toString() }
  })

const RegionForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: { ...createCompoundInitialState(SubForms) },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, { region: { items: [] } }),
  Component: ({ state, setState, regionData, postalCode }) => {
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
          setState(() => ({ region: { selectedText: id.toString() } }))
        }
      },
      variables: { postalCode: postalCode, projectId: projectId },
      skip: postalCode.length !== 5,
    })
    // TODO adjust validation

    return (
      <SubForms.region.Component
        state={state.region}
        setState={useUpdateStateCallback(setState, 'region')}
        label='Region'
        options={{ items: getOptions(regionData) }}
      />
    )
  },
}

export default RegionForm
