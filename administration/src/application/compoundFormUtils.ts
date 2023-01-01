import { Form, ValidationResult } from './FormType'
import { mapValues } from 'lodash'

type AnyForm = Form<any, any, any, any>
type SubForms = { [key: string]: AnyForm }
type InferState<F extends AnyForm> = F extends Form<infer State, any, any, any> ? State : never
type InferOptions<F extends AnyForm> = F extends Form<any, infer Options, any, any> ? Options : never
type InferValidatedInput<F extends AnyForm> = F extends Form<any, any, infer ValidatedInput, any>
  ? ValidatedInput
  : never

export type CompoundState<Forms extends SubForms> = { [key in keyof Forms]: InferState<Forms[key]> }
type CompoundValidatedInput<Forms extends SubForms> = {
  [key in keyof Forms]: InferValidatedInput<Forms[key]>
}

export function createCompoundGetArrayBufferKeys<Forms extends SubForms>(
  subForms: Forms
) {
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
      (form, key) => {
        if (key in subFormsOptions) {
          const optionsKey = key as KeysWithOptions<Forms>
          return form.getValidatedInput(state[key], subFormsOptions[optionsKey])
        } else {
          return form.getValidatedInput(state[key])
        }
      }
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

export function createCompoundInitialState<Forms extends SubForms>(
  subForms: Forms
): CompoundState<Forms> {
  return mapValues(subForms, form => form.initialState)
}
