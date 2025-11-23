import { AttachFile, Attachment } from '@mui/icons-material'
import { Button, Chip } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ChangeEventHandler, useContext, useEffect, useRef } from 'react'

import { AttachmentInput } from '../../../generated/graphql'
import i18next from '../../../i18n'
import FormAlert from '../../base/FormAlert'
import { FormContext } from '../SteppedSubForms'
import { Form, FormComponentProps, ValidationResult } from '../util/FormType'
import globalArrayBuffersManager from '../util/globalArrayBuffersManager'

const defaultExtensionsByMIMEType = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
}

const FILE_SIZE_LIMIT_MEGA_BYTES = 5
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000

export const FileRequirementsText = i18next.t('applicationForms:fileRequirementsError', {
  fileSizeLimit: FILE_SIZE_LIMIT_MEGA_BYTES,
})

const FileInputButton = ({
  onChange,
  label,
  disabled,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>
  label: string
  disabled: boolean
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Button
        startIcon={<AttachFile />}
        variant='contained'
        onClick={() => inputRef.current?.click()}
        disabled={disabled}>
        {label}
      </Button>
      <input ref={inputRef} type='file' accept='.pdf,.jpeg,.jpg,.png' onChange={onChange} hidden />
    </>
  )
}

type State = {
  MIMEType: keyof typeof defaultExtensionsByMIMEType
  arrayBufferKey: number
  filename: string
} | null
type ValidatedInput = AttachmentInput

const Component = <I,>({
  state,
  setState,
  required,
  validate,
}: FormComponentProps<State> & {
  required: boolean
  validate: (state: State) => ValidationResult<I>
}) => {
  const { enqueueSnackbar } = useSnackbar()
  const { showAllErrors, disableAllInputs } = useContext(FormContext)
  const validationResult = validate(state)
  const onInputChange: ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files![0]
    if (!(file.type in defaultExtensionsByMIMEType)) {
      enqueueSnackbar(i18next.t('errors:invalidFileType'), { variant: 'error' })
      e.target.value = ''
      return
    }
    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      enqueueSnackbar(i18next.t('errors:invalidFileSizeWithMaximum', { maxSize: FILE_SIZE_LIMIT_MEGA_BYTES }), {
        variant: 'error',
      })
      e.target.value = ''
      return
    }
    const fileType = file.type as keyof typeof defaultExtensionsByMIMEType
    const arrayBuffer = await file.arrayBuffer()
    const key = globalArrayBuffersManager.addArrayBuffer(arrayBuffer)
    setState(() => ({ MIMEType: fileType, filename: file.name, arrayBufferKey: key }))
  }

  useEffect(() => {
    if (state === null) {
      return
    }
    // If the arrayBufferManager doesn't have the specified key, let user reenter a File.
    if (!globalArrayBuffersManager.has(state.arrayBufferKey)) {
      setState(() => null)
    }
  }, [state, setState])

  if (state === null) {
    return (
      <>
        <FileInputButton
          onChange={onInputChange}
          label={`${i18next.t('applicationForms:attachFileButton')}${required ? ' *' : ''}`}
          disabled={disableAllInputs}
        />
        {showAllErrors && validationResult.type === 'error' && <FormAlert errorMessage={validationResult.message} />}
      </>
    )
  }

  return (
    <Chip
      sx={{ marginRight: 1 }}
      label={state.filename}
      icon={<Attachment />}
      onDelete={disableAllInputs ? undefined : () => setState(() => null)}
    />
  )
}

const FileInputForm: Form<State, ValidatedInput> = {
  initialState: null,
  getArrayBufferKeys: state => (state === null ? [] : [state.arrayBufferKey]),
  validate: state => {
    if (state === null) {
      return { type: 'error', message: 'Feld ist erforderlich.' }
    }
    if (!globalArrayBuffersManager.has(state.arrayBufferKey)) {
      return { type: 'error' }
    }
    const arrayBuffer = globalArrayBuffersManager.getArrayBufferByKey(state.arrayBufferKey)
    return {
      type: 'valid',
      value: {
        data: new File([arrayBuffer], state.filename, { type: state.MIMEType }),
      },
    }
  },
  Component: ({ state, setState }) => Component({ state, setState, required: true, validate: FileInputForm.validate }),
}

export const OptionalFileInputForm: Form<State, ValidatedInput | null> = {
  initialState: FileInputForm.initialState,
  getArrayBufferKeys: FileInputForm.getArrayBufferKeys,
  validate: state => {
    if (state === null) {
      return { type: 'valid', value: null }
    }
    return FileInputForm.validate(state)
  },
  Component: ({ state, setState }) =>
    Component({ state, setState, required: false, validate: OptionalFileInputForm.validate }),
}

export default FileInputForm
