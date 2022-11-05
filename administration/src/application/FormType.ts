import { ReactElement } from 'react'
import { SetState } from './useUpdateStateCallback'

export type ValidationSuccess<I> = { type: 'valid'; value: I }
export type ValidationError = { type: 'error'; message?: string }
export type ValidationResult<I> = ValidationError | ValidationSuccess<I>

type Props<State, AdditionalProps, Options> = AdditionalProps & {
  state: State
  setState: SetState<State>
} & ([void] extends [Options] ? { } : { options: Options })

export type Form<State, Options, ValidatedInput, AdditionalProps> = {
  initialState: State
  getValidatedInput: (state: State, options: Options) => ValidationResult<ValidatedInput>
  Component: (props: Props<State, AdditionalProps, Options>) => ReactElement | null
}
