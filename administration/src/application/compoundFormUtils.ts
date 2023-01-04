import { Form, ValidationResult } from './FormType'
import { mapValues } from 'lodash'

type AnyForm = Form<any, any, any, any>
type SubForms = { [key: string]: AnyForm }
export type InferState<F extends AnyForm> = F extends Form<infer State, any, any, any> ? State : never
type InferOptions<F extends AnyForm> = F extends Form<any, infer Options, any, any> ? Options : never
type InferValidatedInput<F extends AnyForm> = F extends Form<any, any, infer ValidatedInput, any>
  ? ValidatedInput
  : never

export type CompoundState<Forms extends SubForms> = { [key in keyof Forms]: InferState<Forms[key]> }
type CompoundValidatedInput<Forms extends SubForms> = {
  [key in keyof Forms]: InferValidatedInput<Forms[key]>
}

export function createCompoundGetArrayBufferKeys<Forms extends SubForms>(subForms: Forms) {
  return (state: CompoundState<Forms>) => {
    const arrayBufferKeys = []
    for (const [key, form] of Object.entries(subForms)) {
      arrayBufferKeys.push(...form.getArrayBufferKeys(state[key]))
    }
    return arrayBufferKeys
  }
}

type KeysWithOptions<Forms extends SubForms> = {
  [K in keyof Forms]: {} extends InferOptions<Forms[K]> ? never : K
}[keyof Forms]
type SubFormsOptions<Forms extends SubForms> = {
  [key in KeysWithOptions<Forms>]: InferOptions<Forms[key]>
}

function getValidatedInputOfKey<Forms extends SubForms, K extends keyof Forms>(
  subForms: Forms,
  subFormsOptions: SubFormsOptions<Forms>,
  key: K,
  state: CompoundState<Forms>
): ValidationResult<InferValidatedInput<Forms[K]>> {
  if (key in subFormsOptions) {
    const optionsKey: KeysWithOptions<Forms> = key as unknown as KeysWithOptions<Forms>
    return subForms[key].getValidatedInput(state[key], subFormsOptions[optionsKey])
  } else {
    return subForms[key].getValidatedInput(state[key])
  }
}

/**
 * Returns an error if the getValidatedInput function of one of the sub forms returns an error.
 * Otherwise, returns a valid result whose value maps a sub form key to its valid input value.
 */
export function createCompoundGetValidatedInput<Forms extends SubForms>(
  subForms: Forms,
  subFormsOptions: SubFormsOptions<Forms>
) {
  return (state: CompoundState<Forms>): ValidationResult<CompoundValidatedInput<Forms>> => {
    const results: { [key in keyof Forms]: ValidationResult<InferValidatedInput<Forms[key]>> } = mapValues(
      subForms,
      (form, key: keyof Forms) => getValidatedInputOfKey(subForms, subFormsOptions, key, state)
    )
    if (Object.values(results).some(result => result.type === 'error')) {
      return { type: 'error' }
    }
    const value = mapValues(results, result => {
      if (result.type === 'error') throw Error('Found error type despite previous check.')
      return result.value
    })
    return { type: 'valid', value }
  }
}

type SwitchValidationInput<Forms extends SubForms, K extends keyof Forms> = {
  [k in K]: InferValidatedInput<Forms[k]>
} & {
  [k in keyof Forms]: InferValidatedInput<Forms[k]> | undefined
}

export function createSwitchGetValidatedInput<Forms extends SubForms, K extends keyof Forms>(
  subForms: Forms,
  subFormsOptions: SubFormsOptions<Forms>,
  switchBy: K,
  selectedKeyByValue: { [v in InferValidatedInput<Forms[K]>]: keyof Forms }
) {
  return (state: CompoundState<Forms>): ValidationResult<SwitchValidationInput<Forms, K>> => {
    const keyResult = getValidatedInputOfKey(subForms, subFormsOptions, switchBy, state)
    if (keyResult.type === 'error') {
      return { type: 'error' }
    }
    const value: InferValidatedInput<Forms[K]> = keyResult.value
    if (!(value in selectedKeyByValue)) {
      return { type: 'error' }
    }
    const selectedKey: keyof Forms = selectedKeyByValue[value]
    const selectedKeyResult = subForms[selectedKey].getValidatedInput(state[selectedKey])
    if (selectedKeyResult.type === 'error') {
      return { type: 'error' }
    }
    return {
      type: 'valid',
      value: {
        [switchBy]: value,
        [selectedKey]: selectedKeyResult.value,
      } as SwitchValidationInput<Forms, K>,
    }
  }
}

export function createCompoundInitialState<Forms extends SubForms>(subForms: Forms): CompoundState<Forms> {
  return mapValues(subForms, form => form.initialState)
}
