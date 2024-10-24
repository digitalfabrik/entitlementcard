import { Button, Tooltip } from '@blueprintjs/core'
import React, { ReactElement, useContext } from 'react'

import { CardBlueprint, isValid } from '../../cards/Card'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ButtonBar from '../ButtonBar'

type CreateCardsButtonBarProps = {
  cardBlueprints: CardBlueprint[]
  goBack: () => void
  generateCardsPdf: () => Promise<void>
  generateCardsCsv: () => Promise<void>
}

const CreateCardsButtonBar = ({
  cardBlueprints,
  generateCardsPdf,
  generateCardsCsv,
  goBack,
}: CreateCardsButtonBarProps): ReactElement => {
  const allCardsValid = cardBlueprints.every(cardBlueprint => isValid(cardBlueprint))
  const { csvExport } = useContext(ProjectConfigContext)

  return (
    <ButtonBar>
      <Button icon='arrow-left' text='Zurück zur Auswahl' onClick={goBack} />
      <Tooltip
        placement='top'
        content={
          cardBlueprints.length === 0
            ? 'Legen Sie zunächst eine Karte an.'
            : 'Mindestens eine Karte enthält ungültige Eingaben.'
        }
        disabled={allCardsValid && cardBlueprints.length > 0}>
        <Button
          icon='export'
          text='QR-Codes drucken'
          intent='success'
          onClick={generateCardsPdf}
          disabled={!allCardsValid || cardBlueprints.length === 0}
        />
      </Tooltip>
      {csvExport.enabled && (
        <Tooltip
          placement='top'
          content={
            cardBlueprints.length === 0
              ? 'Legen Sie zunächst eine Karte an.'
              : 'Mindestens eine Karte enthält ungültige Eingaben.'
          }
          disabled={allCardsValid && cardBlueprints.length > 0}>
          <Button
            icon='th-derived'
            text='CSV Export'
            intent='success'
            onClick={generateCardsCsv}
            disabled={!allCardsValid || cardBlueprints.length === 0}
          />
        </Tooltip>
      )}
    </ButtonBar>
  )
}

export default CreateCardsButtonBar
