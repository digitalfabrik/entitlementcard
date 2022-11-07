import { TextField } from '@mui/material'
import { memo, useContext, useState } from 'react'
import { Form } from '../../FormType'
import { ShortTextInput } from '../../../generated/graphql'
import { FormContext } from '../SteppedSubForms'

export const MAX_SHORT_TEXT_LENGTH = 300

export type ShortTextFormState = {
  shortText: string
}
type ValidatedInput = ShortTextInput
type Options = {}
type AdditionalProps = { label: string; minWidth?: number }
const ShortTextForm: Form<ShortTextFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: { shortText: '' },
  getArrayBufferKeys: () => [],
  getValidatedInput: ({ shortText }) => {
    if (shortText.length === 0) return { type: 'error', message: 'Feld ist erforderlich.' }
    if (shortText.length > MAX_SHORT_TEXT_LENGTH)
      return {
        type: 'error',
        message: `Text überschreitet die maximal erlaubten ${MAX_SHORT_TEXT_LENGTH} Zeichen.`,
      }
    return { type: 'valid', value: { shortText } }
  },
  Component: memo(({ state, setState, label, minWidth = 200 }) => {
    const [touched, setTouched] = useState(false)
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = ShortTextForm.getValidatedInput(state)
    const isInvalid = validationResult.type === 'error'

    return (
      <TextField
        variant='standard'
        fullWidth
        style={{ margin: '4px 0', minWidth }}
        label={label}
        required
        inputProps={{ maxLength: MAX_SHORT_TEXT_LENGTH }}
        disabled={disableAllInputs}
        error={touched && isInvalid}
        onBlur={() => setTouched(true)}
        value={state.shortText}
        onChange={e => setState(() => ({ shortText: e.target.value }))}
        helperText={(showAllErrors || touched) && isInvalid ? validationResult.message : ''}
      />
    )
  }),
}

export default ShortTextForm
