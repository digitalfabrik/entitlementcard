import { Icon, NonIdealState, NonIdealStateIconSize, Spinner } from '@blueprintjs/core'
import { ChangeEventHandler, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'

import CSVCard from '../../cards/CSVCard'
import { useAppToaster } from '../AppToaster'
import ImportCardsRequirementsText from './ImportCardsRequirementsText'

const CardImportInputContainer = styled.div`
  display: flex;
  align-items: center;
`

const InputContainer = styled(NonIdealState)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
`

const defaultExtensionsByMIMEType = {
  'text/csv': '.csv',
}

export const FILE_SIZE_LIMIT_MEGA_BYTES = 2
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000
export const ENTRY_LIMIT = 300

type ImportCardsInputProps = {
  headers: string[]
  setCardBlueprints: (cardBlueprints: CSVCard[]) => void
  lineToBlueprint: (line: string[], csvHeader: string[]) => CSVCard
}

const ImportCardsInput = ({ setCardBlueprints, lineToBlueprint, headers }: ImportCardsInputProps) => {
  const [inputState, setInputState] = useState<'loading' | 'error' | 'idle'>('idle')
  const fileInput = useRef<HTMLInputElement>(null)
  const appToaster = useAppToaster()

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
      const lines = content
        .split('\n')
        .filter(Boolean)
        .map(line => line.split(',').map(cell => cell.trim()))

      const lineLength = lines[0]?.length

      if (!lineLength) {
        showInputError('Die gewählte Datei ist leer.')
        return
      }

      if (lines.length < 2) {
        showInputError('Die Datei muss mindestens einen Eintrag enthalten.')
        return
      }

      if (!lines.every(line => line.length === lineLength)) {
        showInputError('Keine gültige CSV Datei. Nicht jede Reihe enthält gleich viele Elemente.')
        return
      }

      if (lines.length > ENTRY_LIMIT + 1) {
        showInputError(`Die Datei hat mehr als ${ENTRY_LIMIT} Einträge.`)
        return
      }

      const csvHeader = lines.shift() ?? []
      const blueprints = lines.map(line => lineToBlueprint(line, csvHeader))

      setCardBlueprints(blueprints)
      setInputState('idle')
    },
    [lineToBlueprint, setCardBlueprints, showInputError]
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

  const StateIcon =
    inputState === 'error' ? (
      <Icon intent='danger' size={NonIdealStateIconSize.STANDARD} icon={'error'} />
    ) : inputState === 'loading' ? (
      <Spinner intent='primary' />
    ) : (
      'upload'
    )

  return (
    <InputContainer
      title='Wählen Sie eine Datei'
      icon={StateIcon}
      description={<ImportCardsRequirementsText header={headers} />}
      action={
        <CardImportInputContainer>
          <input data-testid='file-upload' ref={fileInput} accept='.csv' type='file' onInput={onInputChange} />
        </CardImportInputContainer>
      }
    />
  )
}

export default ImportCardsInput
