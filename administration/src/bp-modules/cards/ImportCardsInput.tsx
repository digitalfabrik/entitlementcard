import { Button, Stack } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ChangeEvent, ReactElement, useCallback, useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import { Card, initializeCardFromCSV } from '../../cards/Card'
import { Region } from '../../generated/graphql'
import NonIdealState from '../../mui-modules/NonIdealState'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { getCsvHeaders } from '../../project-configs/helper'
import FileInputStateIcon from '../FileInputStateIcon'
import { FREINET_PARAM } from '../constants'
import convertFreinetImport from '../util/convertFreinetImport'
import ImportCardsRequirementsText from './ImportCardsRequirementsText'
import { ENTRY_LIMIT, FILE_SIZE_LIMIT_MEGA_BYTES } from './constants'

const defaultExtensionsByMIMEType = {
  'text/csv': '.csv',
}

const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000

const ImportCardsInput = ({
  setCards,
  region,
}: {
  setCards: (cards: Card[]) => void
  region: Region
}): ReactElement => {
  const isFreinetFormat = new URLSearchParams(useLocation().search).get(FREINET_PARAM) === 'true'
  const projectConfig = useContext(ProjectConfigContext)
  const csvHeaders = getCsvHeaders(projectConfig)
  const { t } = useTranslation('cards')
  const [inputState, setInputState] = useState<'loading' | 'error' | 'idle'>('idle')
  const fileInput = useRef<HTMLInputElement>(null)
  const { enqueueSnackbar } = useSnackbar()

  const showInputError = useCallback(
    (message: string) => {
      enqueueSnackbar(message, { variant: 'error' })
      setInputState('error')
      if (!fileInput.current) {
        return
      }
      fileInput.current.value = ''
    },
    [enqueueSnackbar]
  )

  const onLoadEnd = useCallback(
    (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as string
      const lines = content
        .split('\n')
        .filter(line => line.trim().length)
        .map(line => line.split(/[,;]/).map(cell => cell.trim()))

      const numberOfColumns = lines[0]?.length

      if (!numberOfColumns) {
        showInputError(t('importFileIsEmpty'))
        return
      }

      if (lines.length < 2) {
        showInputError(t('importFileHasNoEntries'))
        return
      }

      if (!lines.every(line => line.length === numberOfColumns)) {
        showInputError(t('importFileInvalidLineLength'))
        return
      }

      if (lines.length > ENTRY_LIMIT + 1) {
        showInputError(t('importFileTooManyEntries', { limit: ENTRY_LIMIT }))
        return
      }

      const [csvHeaders, ...entries] = isFreinetFormat ? convertFreinetImport(lines, projectConfig) : lines
      const cards = entries.map(line => initializeCardFromCSV(projectConfig.card, line, csvHeaders, region))

      setCards(cards)
      setInputState('idle')
    },
    [setCards, showInputError, isFreinetFormat, projectConfig, region, t]
  )

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) {
      return
    }
    const reader = new FileReader()
    reader.onloadend = onLoadEnd

    const file = event.currentTarget.files[0]
    if (!(file.type in defaultExtensionsByMIMEType)) {
      showInputError(t('importFileWrongFormat'))
      return
    }

    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      showInputError(t('importFileTooBig'))
      return
    }
    setInputState('loading')
    reader.readAsText(file)
  }

  return (
    <Stack sx={{ flexGrow: 1, justifyContent: 'center' }}>
      <NonIdealState
        icon={<FileInputStateIcon inputState={inputState} />}
        title={t('selectAFile')}
        description={
          <>
            <ImportCardsRequirementsText csvHeaders={csvHeaders} isFreinetFormat={isFreinetFormat} />
            <Button variant='contained' color='primary' component='label'>
              <input
                style={{ display: 'none' }}
                type='file'
                data-testid='file-upload'
                accept='.csv, text/csv'
                onInput={onInputChange}
              />
              {t('misc:browseButtonLabelSingleFile')}
            </Button>
          </>
        }
      />
    </Stack>
  )
}

export default ImportCardsInput
