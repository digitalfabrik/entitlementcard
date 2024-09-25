import { Checkbox, FormGroup, InputGroup, Intent, Tooltip } from '@blueprintjs/core'
import { Button, styled } from '@mui/material'
import React, { ChangeEvent, ReactElement, useContext, useState } from 'react'

import CardBlueprint from '../../cards/CardBlueprint'
import ClearInputButton from '../../cards/extensions/components/ClearInputButton'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import BasicDialog from '../../mui-modules/application/BasicDialog'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ExtensionForm } from '../cards/AddCardForm'

const PrivacyButton = styled('button')`
  border: none !important;
  background-color: transparent;
  color: blue;
  text-decoration: underline;
  padding: 0;
  cursor: pointer;
`

const StyledButton = styled(Button)`
  background-color: #922224;
  margin-top: 24px;
  :hover {
    color: white;
    background-color: #922224;
  }
`

const StyledCheckbox = styled(Checkbox)`
  margin-top: 24px !important;
  font-size: 16px;
`

type CardSelfServiceFormProps = {
  card: CardBlueprint
  notifyUpdate: () => void
  dataPrivacyAccepted: boolean
  setDataPrivacyAccepted: (value: boolean) => void
  generateCards: () => Promise<void>
}

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
const CardSelfServiceForm = ({
  card,
  notifyUpdate,
  dataPrivacyAccepted,
  setDataPrivacyAccepted,
  generateCards,
}: CardSelfServiceFormProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const projectConfig = useContext(ProjectConfigContext)
  const [openDataPrivacy, setOpenDataPrivacy] = useState<boolean>(false)
  const cardValid = card.isValid()
  const cardCreationDisabled = !cardValid || !dataPrivacyAccepted
  const clearNameInput = () => {
    card.fullName = ''
    notifyUpdate()
  }

  return (
    <>
      <div key={card.id}>
        <FormGroup label='Name'>
          <InputGroup
            large={viewportSmall}
            placeholder='Erika Mustermann'
            autoFocus
            rightElement={
              <ClearInputButton viewportSmall={viewportSmall} onClick={clearNameInput} input={card.fullName} />
            }
            //If the size of the card is too large, show a warning at the name field as it is the only dynamically sized field
            intent={card.isFullNameValid() ? undefined : Intent.DANGER}
            value={card.fullName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              card.fullName = event.target.value
              notifyUpdate()
            }}
          />
        </FormGroup>
        {card.extensions.map((ext, i) => (
          <ExtensionForm key={i} extension={ext} onUpdate={notifyUpdate} viewportSmall={viewportSmall} />
        ))}
        <StyledCheckbox checked={dataPrivacyAccepted} onChange={() => setDataPrivacyAccepted(!dataPrivacyAccepted)}>
          Ich akzeptiere die{' '}
          <PrivacyButton onClick={() => setOpenDataPrivacy(true)}>Datenschutzerklärung</PrivacyButton>.
        </StyledCheckbox>
      </div>
      <Tooltip
        placement='top'
        content={getTooltipMessage(cardValid, dataPrivacyAccepted)}
        disabled={!cardCreationDisabled}>
        <StyledButton onClick={generateCards} variant='contained' disabled={cardCreationDisabled} size='large'>
          Pass erstellen
        </StyledButton>
      </Tooltip>

      <BasicDialog
        open={openDataPrivacy}
        maxWidth='lg'
        onUpdateOpen={setOpenDataPrivacy}
        title={projectConfig.dataPrivacyHeadline}
        content={
          <>
            <projectConfig.dataPrivacyContent />
          </>
        }
      />
    </>
  )
}

export default CardSelfServiceForm
