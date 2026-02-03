import { ReactElement } from 'react'

import { SetState } from '../hooks/useUpdateStateCallback'

export type Form<
  State,
  ValidatedInput,
  AdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  Options extends Record<string, unknown> = Record<string, unknown>,
> = {
  initialState: State
  validate: Validate<State, Options, ValidatedInput>
  getArrayBufferKeys: (state: State) => number[]
  Component: (props: FormComponentProps<State, AdditionalProps, Options>) => ReactElement | null
}

export type ValidationSuccess<I> = { type: 'valid'; value: I }
export type ValidationError = { type: 'error'; message?: string }
export type ValidationResult<I> = ValidationError | ValidationSuccess<I>

// Do not require an `options` parameter, if Options is an empty object.
export type Validate<State, Options, ValidatedInput> =
  Record<string, unknown> extends Options
    ? (state: State, options?: Options) => ValidationResult<ValidatedInput>
    : (state: State, options: Options) => ValidationResult<ValidatedInput>

// Do not require `options` prop, if Options is an empty object.
type OptionsProps<Options extends Record<string, unknown>> =
  Record<string, unknown> extends Options ? { options?: Options } : { options: Options }

export type FormComponentProps<
  State,
  AdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  Options extends Record<string, unknown> = Record<string, unknown>,
> = AdditionalProps &
  OptionsProps<Options> & {
    state: State
    setState: SetState<State>
  }
