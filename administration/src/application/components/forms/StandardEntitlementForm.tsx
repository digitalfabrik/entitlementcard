import { Alert, Button } from '@mui/material'
import {
  convertWorkAtOrganizationFormStateToInput,
  initialWorkAtOrganizationFormState,
  WorkAtOrganizationForm,
  WorkAtOrganizationFormState,
} from './WorkAtOrganizationForm'
import { WorkAtOrganizationInput } from '../../../generated/graphql'
import { SetState } from './useUpdateStateCallback'
import { useCallback } from 'react'

export type StandardEntitlementFormState = { key: number; value: WorkAtOrganizationFormState }[]

export const initialStandardEntitlementFormState: StandardEntitlementFormState = [
  {
    key: 0,
    value: initialWorkAtOrganizationFormState,
  },
]

export const StandardEntitlementForm = ({
  state,
  setState,
}: {
  state: StandardEntitlementFormState
  setState: SetState<StandardEntitlementFormState>
}) => {
  const addActivity = () =>
    setState(state => {
      const newKey = Math.max(...state.map(({ key }) => key), 0) + 1
      return [...state, { key: newKey, value: initialWorkAtOrganizationFormState }]
    })

  const setStateByKey: (key: number) => SetState<WorkAtOrganizationFormState> = useCallback(
    key => update =>
      setState(state => {
        const index = state.findIndex(element => element.key === key)
        return replaceAt(state, index, { key, value: update(state[index].value) })
      }),
    [setState]
  )

  return (
    <>
      <h3>Ehrenamtliche Tätigkeit(en)</h3>
      {state.map(({ key, value }, index) => (
        <WorkAtOrganizationForm
          key={key}
          listKey={key}
          state={value}
          onDelete={state.length <= 1 ? undefined : () => setState(state => removeAt(state, index))}
          setStateByKey={setStateByKey}
        />
      ))}
      {state.length < 10 ? (
        <Button onClick={addActivity}>Weitere Tätigkeit hinzufügen</Button>
      ) : (
        <Alert severity='info'>Maximale Anzahl an Tätigkeiten erreicht.</Alert>
      )}
    </>
  )
}

export const convertStandardEntitlementFormStateToInput = (
  state: StandardEntitlementFormState
): WorkAtOrganizationInput[] => {
  return state.map(({ value }) => convertWorkAtOrganizationFormStateToInput(value))
}

function replaceAt<T>(array: T[], index: number, newItem: T): T[] {
  const newArray = [...array]
  newArray[index] = newItem
  return newArray
}

function removeAt<T>(array: T[], index: number): T[] {
  const newArray = [...array]
  newArray.splice(index, 1)
  return newArray
}
