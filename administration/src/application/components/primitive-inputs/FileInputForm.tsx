import { AttachFile, Attachment } from '@mui/icons-material'
import { Button, Chip, FormHelperText } from '@mui/material'
import { ChangeEventHandler, useEffect, useRef } from 'react'
import { AttachmentInput } from '../../../generated/graphql'
import globalArrayBuffersManager from '../../globalArrayBuffersManager'

const defaultExtensionsByMIMEType = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
}

export type FileFormState = {
  MIMEType: keyof typeof defaultExtensionsByMIMEType
  arrayBufferKey: number
  filename: string
} | null

export const initialFileFormState: FileFormState = null

export const FILE_SIZE_LIMIT_MEGA_BYTES = 5
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000

const useShowAllErrors = () => true

export const FileForm = ({
  state,
  setState,
}: {
  state: FileFormState
  setState: (value: FileFormState) => void
  label: string
  minWidth?: number
}) => {
  const showAllErrors = useShowAllErrors()

  const onInputChange: ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files![0]
    if (!(file.type in defaultExtensionsByMIMEType)) {
      alert('Die gewählte Datei hat einen unzulässigen Dateityp.')
      e.target.value = ''
      return
    }
    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      alert(`Die gewählte Datei ist zu groß. Die maximale Dateigröße beträgt ${FILE_SIZE_LIMIT_MEGA_BYTES}MB.`)
      e.target.value = ''
      return
    }
    const fileType = file.type as keyof typeof defaultExtensionsByMIMEType
    const name = 'file' + defaultExtensionsByMIMEType[fileType]
    const arrayBuffer = await file.arrayBuffer()
    const key = globalArrayBuffersManager.addArrayBuffer(arrayBuffer)
    setState({ MIMEType: fileType, filename: name, arrayBufferKey: key })
  }

  useEffect(() => {
    if (state === null) {
      return
    }
    // If the arrayBufferManager doesn't have the specified key, let user reenter a File.
    if (!globalArrayBuffersManager.has(state.arrayBufferKey)) {
      setState(null)
    } else {
      // Remove the arrayBuffer from the storage once the component unmounts.
      return () => globalArrayBuffersManager.removeArrayBufferByKey(state.arrayBufferKey)
    }
  }, [state, setState])

  if (state === null) {
    return (
      <>
        <FileInput onChange={onInputChange} label='Datei Anhängen' />
        {showAllErrors ? <FormHelperText error>Feld ist erforderlich.</FormHelperText> : null}
      </>
    )
  }

  return <Chip label={`Datei angehängt`} icon={<Attachment />} onDelete={() => setState(null)} />
}

const FileInput = ({ onChange, label }: { onChange: ChangeEventHandler<HTMLInputElement>; label: string }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Button startIcon={<AttachFile />} variant='contained' onClick={() => inputRef.current?.click()}>
        {label}
      </Button>
      <input ref={inputRef} type='file' required accept='.pdf,.jpeg,.jpg,.png' onChange={onChange} hidden />
    </>
  )
}

export const convertRequiredFileFormStateToInput = (state: FileFormState): AttachmentInput => {
  if (state === null) {
    throw Error('Invalid argument.')
  }
  const arrayBuffer = globalArrayBuffersManager.getArrayBufferByKey(state.arrayBufferKey)
  return {
    fileName: state.filename,
    data: new File([arrayBuffer], state.filename, { type: state.MIMEType }),
  }
}
