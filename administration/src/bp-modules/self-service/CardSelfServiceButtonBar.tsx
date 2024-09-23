import { Tooltip } from '@blueprintjs/core'
import { Button } from '@mui/material'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import CardBlueprint from '../../cards/CardBlueprint'
import { CardActivationState } from '../cards/hooks/useCardGenerator'

type CardSelfServiceButtonBarProps = {
  cardBlueprint: CardBlueprint
  dataPrivacyAccepted: boolean
  deepLink: string
  generateCards: () => Promise<void>
  downloadPdf: () => Promise<void>
  activationState: CardActivationState
}

const StyledTooltip = styled(Tooltip)`
  align-self: center;
`

const StyledButton = styled(Button)`
  margin: 5px !important;
  :hover {
    color: white;
  }
`

const Container = styled.div`
  margin-top: 24px;
  flex-direction: row;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
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
  activationState,
}: CardSelfServiceButtonBarProps): ReactElement => {
  const cardValid = cardBlueprint.isValid()
  const cardCreationDisabled = !cardValid || !dataPrivacyAccepted

  return (
    <Container>
      {activationState === CardActivationState.input && (
        <StyledTooltip
          placement='top'
          content={getTooltipMessage(cardValid, dataPrivacyAccepted)}
          disabled={!cardCreationDisabled}>
          <Button onClick={generateCards} variant='contained' disabled={cardCreationDisabled} color='success'>
            Pass erstellen
          </Button>
        </StyledTooltip>
      )}
      {activationState === CardActivationState.finished && (
        <>
          <StyledButton href={deepLink} variant='contained' disabled={!deepLink} color='success'>
            Pass aktivieren
          </StyledButton>
          <StyledButton onClick={downloadPdf} variant='contained' color='primary'>
            Download PDF
          </StyledButton>
        </>
      )}
    </Container>
  )
}

export default CardSelfServiceButtonBar
