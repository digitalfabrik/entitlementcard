/* eslint-disable no-nested-ternary */
import { ArrowBack, UploadFile } from '@mui/icons-material'
import { Button, Tooltip } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, isValid } from '../../../cards/Card'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import ButtonBar from '../../../shared/components/ButtonBar'
import { CsvIcon } from '../../../shared/icons/CsvIcon'

const CreateCardsButtonBar = ({
  cards,
  generateCardsPdf,
  generateCardsCsv,
  goBack,
}: {
  cards: Card[]
  goBack: () => void
  generateCardsPdf: () => Promise<void>
  generateCardsCsv: () => Promise<void>
}): ReactElement => {
  const { csvExport, card: cardConfig } = useContext(ProjectConfigContext)
  const allCardsValid = cards.every(card => isValid(card, cardConfig))
  const { t } = useTranslation('cards')
  // prettier-ignore
  const tooltipText = cards.length === 0
    ? t('createOneCard')
    : (!allCardsValid ? t('atLeastOneCardIsInvalid') : undefined)
  const buttonDisabled = !allCardsValid || cards.length === 0

  return (
    <ButtonBar>
      <Button startIcon={<ArrowBack />} onClick={goBack}>
        {t('backToSelection')}
      </Button>

      <Tooltip placement='top' title={tooltipText}>
        <span>
          <Button
            startIcon={<UploadFile />}
            onClick={generateCardsPdf}
            disabled={buttonDisabled}
            color='primary'
            variant='contained'>
            {t('printQRCodes')}
          </Button>
        </span>
      </Tooltip>

      {csvExport.enabled && (
        <Tooltip placement='top' title={tooltipText}>
          <span>
            <Button
              startIcon={<CsvIcon />}
              onClick={generateCardsCsv}
              disabled={buttonDisabled}
              color='primary'
              variant='contained'>
              {t('exportCsv')}
            </Button>
          </span>
        </Tooltip>
      )}
    </ButtonBar>
  )
}

export default CreateCardsButtonBar
