import { ReactElement } from 'react'
import { SetState } from './useUpdateStateCallback'

export type Form<State, Options extends {}, ValidatedInput, AdditionalProps extends {}> = {
  initialState: State
  getValidatedInput: GetValidatedInput<State, Options, ValidatedInput>
  getArrayBufferKeys: (state: State) => number[]
  Component: (props: Props<State, AdditionalProps, Options>) => ReactElement | null
}

export type ValidationSuccess<I> = { type: 'valid'; value: I }
export type ValidationError = { type: 'error'; message?: string }
export type ValidationResult<I> = ValidationError | ValidationSuccess<I>

// Do not require an `options` parameter, if Options is an empty object.
export type GetValidatedInput<State, Options, ValidatedInput> = {} extends Options
    ? (state: State, options?: Options) => ValidationResult<ValidatedInput>
    : (state: State, options: Options) => ValidationResult<ValidatedInput>

// Do not require `options` prop, if Options is an empty object.
type OptionsProps<Options extends {}> = {} extends Options ? { options?: Options } : { options: Options }

type Props<State, AdditionalProps extends {}, Options extends {}> = AdditionalProps &
    OptionsProps<Options> & {
  state: State
  setState: SetState<State>
}