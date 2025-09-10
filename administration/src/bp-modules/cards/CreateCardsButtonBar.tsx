import { Tooltip } from '@blueprintjs/core'
import { ArrowBack, UploadFile } from '@mui/icons-material'
import { Button } from '@mui/material'
import React, { ReactElement, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, isValid } from '../../cards/Card'
import { CsvIcon } from '../../components/icons/CsvIcon'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ButtonBar from '../ButtonBar'

type CreateCardsButtonBarProps = {
  cards: Card[]
  goBack: () => void
  generateCardsPdf: () => Promise<void>
  generateCardsCsv: () => Promise<void>
}

const CreateCardsButtonBar = ({
  cards,
  generateCardsPdf,
  generateCardsCsv,
  goBack,
}: CreateCardsButtonBarProps): ReactElement => {
  const { csvExport, card: cardConfig } = useContext(ProjectConfigContext)
  const allCardsValid = cards.every(card => isValid(card, cardConfig))
  const { t } = useTranslation('cards')

  return (
    <ButtonBar>
      <Button startIcon={<ArrowBack />} onClick={goBack}>
        {t('backToSelection')}
      </Button>

      <Tooltip
        placement='top'
        content={cards.length === 0 ? t('createOnCard') : t('atLeastOnCardIsInvalid')}
        disabled={allCardsValid && cards.length > 0}>
        <Button
          startIcon={<UploadFile />}
          onClick={generateCardsPdf}
          disabled={!allCardsValid || cards.length === 0}
          variant='contained'>
          {t('printQRCodes')}
        </Button>
      </Tooltip>

      {csvExport.enabled && (
        <Tooltip
          placement='top'
          content={cards.length === 0 ? t('createOnCard') : t('atLeastOnCardIsInvalid')}
          disabled={allCardsValid && cards.length > 0}>
          <Button
            startIcon={<CsvIcon />}
            onClick={generateCardsCsv}
            disabled={!allCardsValid || cards.length === 0}
            color='primary'>
            {t('exportCsv')}
          </Button>
        </Tooltip>
      )}
    </ButtonBar>
  )
}

export default CreateCardsButtonBar
