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
  const storeData = line.reduce((acc, entry, index) => {
    const columnName = headers[index]
    // TODO 1570 get geodata if no coordinates available
    return { ...acc, [columnName]: entry }
  }, {})
  return new AcceptingStoreEntry(storeData, fields)
}

const hasStoreDuplicates = (stores: AcceptingStoreEntry[]) => {
  return (
    new Set(
      stores.map(({ data }: { data: StoreData }) =>
        JSON.stringify([data['name'], data['street'], data['houseNumber'], data['postalCode'], data['location']])
      )
    ).size < stores.length
  )
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

  const onLoadEnd = useCallback(
    (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as string
      let lines: [][] = []
      try {
        lines = parse(content, {
          delimiter: ',',
          encoding: 'utf-8',
        })
      } catch (error) {
        if (error instanceof Error && error.message.includes('line')) {
          showInputError(
            `Keine gültige CSV Datei. Nicht jede Reihe enthält gleich viele Spalten. (Fehler in Zeile ${error.message
              .split('line')[1]
              .trim()})`
          )
          return
        }
        showInputError('Beim Verarbeiten der Datei ist ein unbekannter Fehler aufgetreten')
        return
      }
      const numberOfColumns = lines[0]?.length

      if (!numberOfColumns) {
        showInputError('Die gewählte Datei ist leer.')
        return
      }

      if (lines.length < 2) {
        showInputError('Die Datei muss mindestens einen Eintrag enthalten.')
        return
      }

      if (lines.some((line: string[]) => line.length !== headers.length)) {
        showInputError(`Die CSV enthält eine ungültige Anzahl an Spalten.`)
        return
      }

      const csvHeader = lines.shift() ?? []

      if (csvHeader.toString() !== headers.toString()) {
        showInputError(`Die erforderlichen Spalten sind nicht vorhanden oder nicht in der richtigen Reihenfolge.`)
        return
      }
      const acceptingStores = lines.map((line: string[]) => lineToStoreEntry(line, csvHeader, fields))

      if (hasStoreDuplicates(acceptingStores)) {
        showInputError(`Die CSV enthält doppelte Einträge.`)
        return
      }

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
    reader.onloadend = onLoadEnd

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
