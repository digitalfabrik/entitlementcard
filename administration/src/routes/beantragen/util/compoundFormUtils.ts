/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, ValidationResult } from './formType'

const mapValues = <
  VPre extends { [k in keyof VPre]: unknown },
  VPost extends { [k in keyof VPre]: unknown },
>(
  object: { [k in keyof VPre]: VPre[k] },
  map: <k extends keyof VPre>(value: VPre[k], key: k) => VPost[k],
): { [k in keyof VPre]: VPost[k] } => {
  const result: Partial<VPost> = Object.entries(object).reduce(
    (result: Partial<VPost>, [key, value]) => {
      // We assume that `key` is in VPre. We would need a typescript feature (exact types) to remove this assumption.
      // The lodash mapValues types suffer from the same problems.
      // (see https://github.com/microsoft/TypeScript/issues/12936)
      const validKey = key as keyof VPre
      const validValue = value as VPre[typeof validKey]
      result[validKey] = map(validValue, validKey)
      return result
    },
    {},
  )
  return result as VPost
}

type AnyForm = Form<any, any, any, any>
type SubForms = { [key: string]: AnyForm }
export type InferState<F extends AnyForm> =
  F extends Form<infer State, any, any, any> ? State : never
type InferOptions<F extends AnyForm> =
  F extends Form<any, any, any, infer Options> ? Options : never
type InferValidatedInput<F extends AnyForm> =
  F extends Form<any, infer ValidatedInput, any, any> ? ValidatedInput : never

export type CompoundState<Forms extends SubForms> = { [key in keyof Forms]: InferState<Forms[key]> }
type CompoundValidatedInput<Forms extends SubForms> = {
  [key in keyof Forms]: InferValidatedInput<Forms[key]>
}

export const createCompoundInitialState = <Forms extends SubForms>(
  subForms: Forms,
): CompoundState<Forms> =>
  mapValues<Forms, CompoundState<Forms>>(
    subForms,
    <k extends keyof Forms>(form: Forms[k]) => form.initialState as InferState<Forms[k]>,
  )

/**
 * Creates a getArrayBufferKeys function that returns all keys of all sub forms.
 * */
export const createCompoundGetArrayBufferKeys =
  <Forms extends SubForms>(subForms: Forms) =>
  (state: CompoundState<Forms>): number[] =>
    Object.entries(subForms)
      .map(([key, form]) => form.getArrayBufferKeys(state[key]))
      .flat()

type KeyWithOptions<Forms extends SubForms> = {
  [key in keyof Forms]: Record<string, never> extends InferOptions<Forms[key]> ? never : key
}[keyof Forms]
type SubFormsOptions<Forms extends SubForms> = {
  [key in KeyWithOptions<Forms>]: InferOptions<Forms[key]>
}

type InferValidationResult<T extends AnyForm> = ValidationResult<InferValidatedInput<T>>

const validateKey = <Forms extends SubForms, K extends keyof Forms>(
  subForms: Forms,
  subFormsOptions: SubFormsOptions<Forms>,
  key: K,
  state: CompoundState<Forms>,
): InferValidationResult<Forms[K]> => {
  if (key in subFormsOptions) {
    const optionsKey = key as unknown as KeyWithOptions<Forms>
    return subForms[key].validate(state[key], subFormsOptions[optionsKey]) as InferValidationResult<
      Forms[K]
    >
  }
  return subForms[key].validate(state[key]) as InferValidationResult<Forms[K]>
}

/**
 * Returns an error if the getValidatedInput function of one of the sub forms returns an error.
 * Otherwise, returns a valid result whose value maps a sub form key to its valid input value.
 */
export const createCompoundValidate =
  <Forms extends SubForms>(subForms: Forms, subFormsOptions: SubFormsOptions<Forms>) =>
  (state: CompoundState<Forms>): ValidationResult<CompoundValidatedInput<Forms>> => {
    const results = mapValues<
      Forms,
      { [key in keyof Forms]: ValidationResult<InferValidatedInput<Forms[key]>> }
    >(subForms, (form, key) => validateKey(subForms, subFormsOptions, key, state))
    if (Object.values(results).some(result => result.type === 'error')) {
      return { type: 'error' }
    }
    const value = mapValues<typeof results, CompoundValidatedInput<Forms>>(results, result => {
      if (result.type === 'error') {
        throw Error('Found error type despite previous check.')
      }
      return result.value
    })
    return { type: 'valid', value }
  }

type SwitchValidationInput<Forms extends SubForms, K extends keyof Forms> = {
  [k in K]: InferValidatedInput<Forms[k]>
} & {
  [k in keyof Forms]: InferValidatedInput<Forms[k]> | undefined
}

type FormWithStringValidatedInput = Form<any, string, any, any>

export const createSwitchValidate =
  <K extends string, Forms extends SubForms & { [k in K]: FormWithStringValidatedInput }>(
    subForms: Forms,
    subFormsOptions: SubFormsOptions<Forms>,
    switchBy: K,
    selectedKeyByValue: { [v in InferValidatedInput<Forms[K]>]: keyof Forms },
  ) =>
  (state: CompoundState<Forms>): ValidationResult<SwitchValidationInput<Forms, K>> => {
    const keyResult = validateKey(subForms, subFormsOptions, switchBy, state)
    if (keyResult.type === 'error') {
      return { type: 'error' }
    }
    const value: InferValidatedInput<Forms[K]> = keyResult.value
    if (!(value in selectedKeyByValue)) {
      return { type: 'error' }
    }
    const selectedKey: keyof Forms = selectedKeyByValue[value]
    const selectedKeyResult = subForms[selectedKey].validate(state[selectedKey])
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
