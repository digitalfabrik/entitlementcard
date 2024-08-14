import { NonIdealState } from '@blueprintjs/core'
import { parse } from 'csv-parse/browser/esm/sync'
import React, { ChangeEventHandler, ReactElement, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { StoreFieldConfig } from '../../project-configs/getProjectConfig'
import { useAppToaster } from '../AppToaster'
import FileInputStateIcon, { FileInputStateType } from '../FileInputStateIcon'
import { AcceptingStoreEntry } from './AcceptingStoreEntry'
import { StoreData } from './StoresImportController'
import StoresRequirementsText from './StoresRequirementsText'

const StoreImportInputContainer = styled.div`
  display: flex;
  align-items: center;
`

const InputContainer = styled(NonIdealState)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
`
type StoresCsvInputProps = {
  setAcceptingStores: (store: AcceptingStoreEntry[]) => void
  fields: StoreFieldConfig[]
}

export const FILE_SIZE_LIMIT_MEGA_BYTES = 2
const defaultExtensionsByMIMEType = {
  'text/csv': '.csv',
}
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000

const lineToStoreEntry = (line: string[], headers: string[], fields: StoreFieldConfig[]): AcceptingStoreEntry => {
  let storeData: StoreData = {}
  line.forEach((entry, index) => {
    const columnName = headers[index]
    // TODO 1570 get geodata if no coordinates available
    storeData = { ...storeData, [columnName]: entry }
  })
  return new AcceptingStoreEntry(storeData, fields)
}

const StoresCsvInput = ({ setAcceptingStores, fields }: StoresCsvInputProps): ReactElement => {
  const [inputState, setInputState] = useState<FileInputStateType>('idle')
  const fileInput = useRef<HTMLInputElement>(null)
  const appToaster = useAppToaster()
  const headers = fields.map(field => field.name)

  const showInputError = useCallback(
    (message: string) => {
      appToaster?.show({ intent: 'danger', message })
      setInputState('error')
      if (!fileInput.current) return
      fileInput.current.value = ''
    },
    [appToaster]
  )

  const onLoadend = useCallback(
    (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as string

      const lines = parse(content, {
        delimiter: ',',
        encoding: 'utf-8',
      })
      const numberOfColumns = lines[0]?.length

      if (!numberOfColumns) {
        showInputError('Die gewählte Datei ist leer.')
        return
      }

      if (lines.length < 2) {
        showInputError('Die Datei muss mindestens einen Eintrag enthalten.')
        return
      }

      if (!lines.every((line: string[]) => line.length === numberOfColumns)) {
        showInputError('Keine gültige CSV Datei. Nicht jede Reihe enthält gleich viele Elemente.')
        return
      }

      const csvHeader = lines.shift() ?? []

      if (csvHeader.toString() !== headers.toString()) {
        showInputError(`Das Spaltenformat ist nicht korrekt.`)
        return
      }

      const acceptingStores = lines.map((line: string[]) => lineToStoreEntry(line, csvHeader, fields))

      setAcceptingStores(acceptingStores)
      setInputState('idle')
    },
    [showInputError, setAcceptingStores, setInputState, headers]
  )

  const onInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    if (!event.currentTarget?.files) {
      return
    }
    const reader = new FileReader()
    reader.onloadend = onLoadend

    const file = event.currentTarget.files[0]
    if (!(file.type in defaultExtensionsByMIMEType)) {
      showInputError('Die gewählte Datei hat einen unzulässigen Dateityp.')
      return
    }

    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      showInputError('Die ausgewählete Datei ist zu groß.')
      return
    }
    setInputState('loading')
    reader.readAsText(file)
  }

  return (
    <InputContainer
      title='Wählen Sie eine Datei'
      icon={<FileInputStateIcon inputState={inputState} />}
      description={<StoresRequirementsText header={headers} />}
      action={
        <StoreImportInputContainer>
          <input
            data-testid='store-file-upload'
            ref={fileInput}
            accept='.csv, text/csv'
            type='file'
            onInput={onInputChange}
          />
        </StoreImportInputContainer>
      }
    />
  )
}

export default StoresCsvInput