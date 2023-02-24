import { Region, ShortTextInput, useGetRegionByPostalCodeQuery } from '../../../generated/graphql'
import { useUpdateStateCallback } from '../../useUpdateStateCallback'
import { Form } from '../../FormType'
import {
  CompoundState,
  createCompoundGetArrayBufferKeys,
  createCompoundValidate,
  createCompoundInitialState,
} from '../../compoundFormUtils'
import SelectForm from '../primitive-inputs/SelectForm'
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

const RegionForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: { ...createCompoundInitialState(SubForms) },
  getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
  validate: createCompoundValidate(SubForms, { region: [] }),
  Component: ({ state, setState, regionData, postalCode }) => {
    const projectId = useContext(ProjectConfigContext).projectId
    const { enqueueSnackbar } = useSnackbar()
    const { loading: loadingCurrentRegionId, data: currentRegionId } = useGetRegionByPostalCodeQuery({
      onError: () => {
        enqueueSnackbar('Region konnte nicht ermittelt werden. Bitte wählen sie ihre Region manuell aus.', {
          variant: 'warning',
        })
      },
      onCompleted: result => {
        if (result.region) {
          const { name, prefix } = result.region
          enqueueSnackbar(`${getOptionsLabel(prefix, name)} wurde als ihre Region ermittelt.`, {
            variant: 'success',
          })
        }
      },
      variables: { postalCode: postalCode, projectId: projectId },
      skip: postalCode.length !== 5,
    })
    // TODO add region values to options, adjust validation, set currentRegionId in state instead setting default value
    const defaultValue =
      !loadingCurrentRegionId && currentRegionId?.region
        ? regionData.find(region => region.id === currentRegionId.region?.id)
        : ''

    console.log(state.region)
    return (
      <SubForms.region.Component
        state={state.region}
        defaultValue={
          currentRegionId && defaultValue ? `${getOptionsLabel(defaultValue.prefix, defaultValue.name)}` : undefined
        }
        setState={useUpdateStateCallback(setState, 'region')}
        label='Region'
        options={regionData.map(region => `${getOptionsLabel(region.prefix, region.name)}`)}
      />
    )
  },
}

export default RegionForm
