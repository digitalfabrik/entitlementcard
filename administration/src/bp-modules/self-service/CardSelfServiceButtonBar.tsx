import { Tooltip } from '@blueprintjs/core'
import { Button } from '@mui/material'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import CardBlueprint from '../../cards/CardBlueprint'
import ButtonBar from '../ButtonBar'

type CardSelfServiceButtonBarProps = {
  cardBlueprint: CardBlueprint
  dataPrivacyAccepted: boolean
  deepLink: string
  generateCards: () => Promise<void>
  downloadPdf: () => Promise<void>
}

const StyledTooltip = styled(Tooltip)`
  align-self: center;
`

const getTooltipMessage = (cardsValid: boolean, dataPrivacyAccepted: boolean): string => {
  const tooltipMessages: string[] = []
  if (!cardsValid) {
    tooltipMessages.push('Mindestens eine Ihrer Angaben ist ungültig.')
  }
  if (!dataPrivacyAccepted) {
    tooltipMessages.push('Bitte akzeptieren sie die Datenschutzerklärung.')
  }

  return tooltipMessages.join(' ')
}

const CardSelfServiceButtonBar = ({
  cardBlueprint,
  dataPrivacyAccepted,
  deepLink,
  generateCards,
  downloadPdf,
}: CardSelfServiceButtonBarProps): ReactElement => {
  const cardValid = cardBlueprint.isValid()
  const cardCreationDisabled = !cardValid || !dataPrivacyAccepted

  return (
    <ButtonBar>
      <StyledTooltip
        placement='top'
        content={getTooltipMessage(cardValid, dataPrivacyAccepted)}
        disabled={!cardCreationDisabled}>
        <Button onClick={generateCards} variant='contained' disabled={cardCreationDisabled} color='success'>
          Pass erstellen
        </Button>
      </StyledTooltip>
      <StyledTooltip placement='top' content='Erstellen Sie zunächst einen Pass' disabled={!deepLink}>
        <Button href={deepLink} variant='contained' disabled={!deepLink} color='primary'>
          Pass aktivieren
        </Button>
      </StyledTooltip>
      <StyledTooltip placement='top' content='Erstellen Sie zunächst einen Pass' disabled={!deepLink}>
        <Button onClick={downloadPdf} variant='contained' disabled={!deepLink} color='primary'>
          Download PDF
        </Button>
      </StyledTooltip>
    </ButtonBar>
  )
}

export default CardSelfServiceButtonBar
