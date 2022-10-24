import { AttachFile, Attachment } from '@mui/icons-material'
import { Button, Chip } from '@mui/material'
import localforage from 'localforage'
import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { AttachmentInput } from '../generated/graphql'

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

const arrayBuffersKey = 'array-buffers'

class ArrayBuffersManager {
  private arrayBuffers: { key: number; value: ArrayBuffer }[] = []

  constructor() {}

  async initialize() {
    const arrayBuffers = await localforage.getItem<{ key: number; value: ArrayBuffer }[]>(arrayBuffersKey)
    if (arrayBuffers !== null) {
      this.arrayBuffers = arrayBuffers
    }
  }

  getArrayBufferByKey(key: number): ArrayBuffer {
    const element = this.arrayBuffers.find(({ key: elementKey }) => key === elementKey)
    if (element == undefined) {
      throw Error('Invalid index')
    }
    return element.value
  }

  addArrayBuffer(arrayBuffer: ArrayBuffer): number {
    const newKey = Math.max(...this.arrayBuffers.map(({ key }) => key), 0) + 1
    this.arrayBuffers.push({ key: newKey, value: arrayBuffer })
    localforage.setItem(arrayBuffersKey, this.arrayBuffers)
    return newKey
  }

  removeArrayBufferByKey(key: number): void {
    this.arrayBuffers = this.arrayBuffers.filter(({ key: elementKey }) => key !== elementKey)
    localforage.setItem(arrayBuffersKey, this.arrayBuffers)
  }

  has(key: number): boolean {
    return this.arrayBuffers.find(({ key: elementKey }) => key === elementKey) !== undefined
  }
}

const globalArrayBuffersManager = new ArrayBuffersManager()

export const useInitializeGlobalArrayBuffersManager = () => {
  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    globalArrayBuffersManager.initialize().finally(() => setInitialized(true))
  }, [])
  return initialized
}

export const FILE_SIZE_LIMIT_MEGA_BYTES = 5
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000

export const FileForm = ({
  state,
  setState,
  label,
  minWidth = 100,
}: {
  state: FileFormState
  setState: (value: FileFormState) => void
  label: string
  minWidth?: number
}) => {
  const [touched, setTouched] = useState(false)
  const isInvalid = state === null

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
    if (!globalArrayBuffersManager.has(state.arrayBufferKey)) {
      setState(null)
    } else {
      return () => globalArrayBuffersManager.removeArrayBufferByKey(state.arrayBufferKey)
    }
  }, [state])

  if (state === null) {
    return <FileInput onChange={onInputChange} label='Datei Anhängen' />
  }

  return (
    <>
      <Chip label={`Datei angehängt`} icon={<Attachment />} onDelete={() => setState(null)} />
    </>
  )
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
