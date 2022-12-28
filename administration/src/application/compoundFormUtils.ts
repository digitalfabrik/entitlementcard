import { Form, ValidationResult } from './FormType'
import { mapValues } from 'lodash'

type AnyForm = Form<any, any, any, any>
export type FormCompounds = { [key: string]: AnyForm }
export type InferState<F extends AnyForm> = F extends Form<infer State, any, any, any> ? State : never
export type InferOptions<F extends AnyForm> = F extends Form<any, infer Options, any, any> ? Options : never
export type InferValidatedInput<F extends AnyForm> = F extends Form<any, any, infer ValidatedInput, any>
  ? ValidatedInput
  : never

export type CompoundState<Forms extends FormCompounds> = { [key in keyof Forms]: InferState<Forms[key]> }
export type CompoundValidatedInput<Forms extends FormCompounds> = {
  [key in keyof Forms]: InferValidatedInput<Forms[key]>
}

export function createCompoundGetArrayBufferKeys<Forms extends { [key: string]: Form<any, any, any, any> }>(
  forms: Forms
) {
  return (state: CompoundState<Forms>) => {
    const arrayBufferKeys = []
    for (const [key, form] of Object.entries(forms)) {
      arrayBufferKeys.push(...form.getArrayBufferKeys(state[key]))
    }
    return arrayBufferKeys
  }
}

export type KeysWithOptions<Forms extends FormCompounds> = {
  [K in keyof Forms]: {} extends InferOptions<Forms[K]> ? never : K
}[keyof Forms]
export type CompoundOptions<Forms extends FormCompounds> = {
  [key in KeysWithOptions<Forms>]: InferOptions<Forms[key]>
}

export function createCompoundGetValidatedInput<Forms extends FormCompounds>(
  forms: Forms,
  compoundOptions: CompoundOptions<Forms>
) {
  return (state: CompoundState<Forms>): ValidationResult<CompoundValidatedInput<Forms>> => {
    const results: { [key in keyof Forms]: ValidationResult<InferValidatedInput<Forms[key]>> } = mapValues(
      forms,
      (form, key) => {
        if (key in compoundOptions) {
          const optionsKey = key as KeysWithOptions<Forms>
          return form.getValidatedInput(state[key], compoundOptions[optionsKey])
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

export function createCompoundInitialState<Forms extends { [key: string]: Form<any, any, any, any> }>(
  forms: Forms
): CompoundState<Forms> {
  return mapValues(forms, form => form.initialState)
}
