import { AttachFile, Attachment } from '@mui/icons-material'
import { Button, Chip, FormHelperText } from '@mui/material'
import { ChangeEventHandler, memo, useContext, useEffect, useRef } from 'react'
import { AttachmentInput } from '../../../generated/graphql'
import globalArrayBuffersManager from '../../globalArrayBuffersManager'
import { Form } from '../../FormType'
import { useSnackbar } from 'notistack'
import { FormContext } from '../SteppedSubForms'

const defaultExtensionsByMIMEType = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
}

export const FILE_SIZE_LIMIT_MEGA_BYTES = 5
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000

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

export type FileInputFormState = {
  MIMEType: keyof typeof defaultExtensionsByMIMEType
  arrayBufferKey: number
  filename: string
} | null
type ValidatedInput = AttachmentInput
type Options = {}
type AdditionalProps = {}
const FileInputForm: Form<FileInputFormState, Options, ValidatedInput, AdditionalProps> = {
  initialState: null,
  getArrayBufferKeys: state => (state === null ? [] : [state.arrayBufferKey]),
  getValidatedInput: state => {
    if (state === null) return { type: 'error', message: 'Feld ist erforderlich.' }
    if (!globalArrayBuffersManager.has(state.arrayBufferKey)) return { type: 'error' }
    const arrayBuffer = globalArrayBuffersManager.getArrayBufferByKey(state.arrayBufferKey)
    return {
      type: 'valid',
      value: {
        data: new File([arrayBuffer], state.filename, { type: state.MIMEType }),
      },
    }
  },
  Component: memo(({ state, setState }) => {
    const { enqueueSnackbar } = useSnackbar()
    const { showAllErrors, disableAllInputs } = useContext(FormContext)
    const validationResult = FileInputForm.getValidatedInput(state)
    const onInputChange: ChangeEventHandler<HTMLInputElement> = async e => {
      const file = e.target.files![0]
      if (!(file.type in defaultExtensionsByMIMEType)) {
        enqueueSnackbar('Die gewählte Datei hat einen unzulässigen Dateityp.', { variant: 'error' })
        e.target.value = ''
        return
      }
      if (file.size > FILE_SIZE_LIMIT_BYTES) {
        enqueueSnackbar(
          `Die gewählte Datei ist zu groß. Die maximale Dateigröße beträgt ${FILE_SIZE_LIMIT_MEGA_BYTES}MB.`,
          { variant: 'error' }
        )
        e.target.value = ''
        return
      }
      const fileType = file.type as keyof typeof defaultExtensionsByMIMEType
      const name = 'file' + defaultExtensionsByMIMEType[fileType]
      const arrayBuffer = await file.arrayBuffer()
      const key = globalArrayBuffersManager.addArrayBuffer(arrayBuffer)
      setState(() => ({ MIMEType: fileType, filename: name, arrayBufferKey: key }))
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
          <FileInputButton onChange={onInputChange} label='Datei Anhängen' disabled={disableAllInputs} />
          {showAllErrors && validationResult.type === 'error' ? (
            <FormHelperText error>{validationResult.message}</FormHelperText>
          ) : null}
        </>
      )
    }

    return (
      <Chip
        label={`Datei angehängt`}
        icon={<Attachment />}
        onDelete={disableAllInputs ? undefined : () => setState(() => null)}
      />
    )
  }),
}

export default FileInputForm
