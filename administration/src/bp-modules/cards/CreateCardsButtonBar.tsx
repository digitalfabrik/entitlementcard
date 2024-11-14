import { Button, Tooltip } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { Card, isValid } from '../../cards/Card'
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
  // TODO pass supported charset
  const allCardsValid = cards.every(card => isValid(card))
  const { csvExport } = useContext(ProjectConfigContext)

  return (
    <ButtonBar>
      <Button icon='arrow-left' text='Zurück zur Auswahl' onClick={goBack} />
      <Tooltip
        placement='top'
        content={
          cards.length === 0 ? 'Legen Sie zunächst eine Karte an.' : 'Mindestens eine Karte enthält ungültige Eingaben.'
        }
        disabled={allCardsValid && cards.length > 0}>
        <Button
          icon='export'
          text='QR-Codes drucken'
          intent='success'
          onClick={generateCardsPdf}
          disabled={!allCardsValid || cards.length === 0}
        />
      </Tooltip>
      {csvExport.enabled && (
        <Tooltip
          placement='top'
          content={
            cards.length === 0
              ? 'Legen Sie zunächst eine Karte an.'
              : 'Mindestens eine Karte enthält ungültige Eingaben.'
          }
          disabled={allCardsValid && cards.length > 0}>
          <Button
            icon='th-derived'
            text='CSV Export'
            intent='success'
            onClick={generateCardsCsv}
            disabled={!allCardsValid || cards.length === 0}
          />
        </Tooltip>
      )}
    </ButtonBar>
  )
}

export default CreateCardsButtonBar
