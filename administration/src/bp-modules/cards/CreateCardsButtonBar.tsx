import { Button } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'

import { CardBlueprint } from '../../cards/CardBlueprint'
import ButtonBar from '../ButtonBar'

type CreateCardsButtonBarProps = {
  cardBlueprints: CardBlueprint[]
  goBack: () => void
  generateCards: () => Promise<void>
}

const CreateCardsButtonBar = ({ cardBlueprints, generateCards, goBack }: CreateCardsButtonBarProps) => {
  const allCardsValid = cardBlueprints.every(cardBlueprint => cardBlueprint.isValid())

  return (
    <ButtonBar>
      <Button icon='arrow-left' text='Zurück zur Auswahl' onClick={goBack} />
      <Tooltip2
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
          onClick={generateCards}
          disabled={!allCardsValid || cardBlueprints.length === 0}
        />
      </Tooltip2>
    </ButtonBar>
  )
}

export default CreateCardsButtonBar
