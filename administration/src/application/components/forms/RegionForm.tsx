import {Region, ShortTextInput, useGetRegionByPostalCodeQuery} from '../../../generated/graphql'
import {useUpdateStateCallback} from '../../useUpdateStateCallback'
import {Form} from '../../FormType'
import {
    CompoundState,
    createCompoundGetArrayBufferKeys,
    createCompoundValidate,
    createCompoundInitialState,
} from '../../compoundFormUtils'
import SelectForm from '../primitive-inputs/SelectForm'

const SubForms = {
    region: SelectForm,
}

type State = CompoundState<typeof SubForms>
type ValidatedInput = { region: ShortTextInput }
type Options = {}
type AdditionalProps = { regionData: Region[]; postalCode: string }

const RegionForm: Form<State, Options, ValidatedInput, AdditionalProps> = {
    initialState: {...createCompoundInitialState(SubForms)},
    getArrayBufferKeys: createCompoundGetArrayBufferKeys(SubForms),
    validate: createCompoundValidate(SubForms, {region: []}),
    Component: ({state, setState, regionData, postalCode}) => {
        const {loading: loadingCurrentRegionId, data: currentRegionId} = useGetRegionByPostalCodeQuery({
            variables: {postalCode: postalCode},
        })

        // TODO check
        const defaultValue = currentRegionId
            ? regionData.filter(region => region.id === currentRegionId.region.id)[0]
            : undefined



        const getLabel = (prefix: string, name: string) => `${name} (${prefix})`

        return (
            <>
                <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                    <div style={{flex: '3'}}>
                        <SubForms.region.Component
                            state={state.region}
                            defaultValue={
                                currentRegionId && defaultValue ? `${getLabel(defaultValue.prefix, defaultValue.name)}` : undefined
                            }
                            setState={useUpdateStateCallback(setState, 'region')}
                            label='Region'
                            options={regionData.map(region => `${getLabel(region.prefix, region.name)}`)}
                        />
                    </div>
                </div>
            </>
        )
    },
}

export default RegionForm
