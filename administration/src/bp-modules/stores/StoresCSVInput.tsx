import { NonIdealState } from '@blueprintjs/core'
import { parse } from 'csv-parse/browser/esm/sync'
import React, { ChangeEventHandler, ReactElement, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import { CsvAcceptingStoreInput } from '../../generated/graphql'
import { StoreFieldConfig } from '../../project-configs/getProjectConfig'
import { useAppToaster } from '../AppToaster'
import FileInputStateIcon, { FileInputStateType } from '../FileInputStateIcon'
import { ENTRY_LIMIT } from '../cards/ImportCardsInput'
import { AcceptingStoreEntry } from './AcceptingStoreEntry'
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
  acceptingStores: AcceptingStoreEntry[]
  setAcceptingStores: (store: AcceptingStoreEntry[]) => void
  fields: StoreFieldConfig[]
}

export const FILE_SIZE_LIMIT_MEGA_BYTES = 2
const defaultExtensionsByMIMEType = {
  'text/csv': '.csv',
}
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000

const lineToStoreEntry = (line: string[], headers: string[], fields: StoreFieldConfig[]): AcceptingStoreEntry => {
  let store: CsvAcceptingStoreInput = {}
  line.forEach((entry, index) => {
    const columnName = headers[index]
    store = { ...store, [columnName]: entry }
  })
  return new AcceptingStoreEntry(store, fields)
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

      if (lines.length < 2) {
        showInputError('Die Datei muss mindestens einen Eintrag enthalten.')
        return
      }

      if (lines.length > ENTRY_LIMIT + 1) {
        showInputError(`Die Datei hat mehr als ${ENTRY_LIMIT} Einträge.`)
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
    [showInputError, setAcceptingStores, setInputState]
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
            data-testid='file-upload'
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
