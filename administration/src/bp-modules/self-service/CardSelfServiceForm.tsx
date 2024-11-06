import { Checkbox, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Alert, styled } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'

import { Card, isFullNameValid, isValid } from '../../cards/Card'
import ClearInputButton from '../../cards/extensions/components/ClearInputButton'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import BasicDialog from '../../mui-modules/application/BasicDialog'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import ExtensionForms from '../cards/ExtensionForms'
import { ActionButton } from './components/ActionButton'
import { IconTextButton } from './components/IconTextButton'
import { UnderlineTextButton } from './components/UnderlineTextButton'

const StyledCheckbox = styled(Checkbox)`
  margin-top: 24px;
  font-size: 16px;
  margin-left: 4px;
`

const StyledAlert = styled(Alert)`
  margin-bottom: 24px;
  white-space: pre-line;
`

const Container = styled('div')`
  margin-bottom: 24px;
`

type CardSelfServiceFormProps = {
  card: Card
  updateCard: (card: Partial<Card>) => void
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
    tooltipMessages.push('Bitte akzeptieren Sie die Datenschutzerklärung.')
  }

  return tooltipMessages.join('\n')
}
const CardSelfServiceForm = ({
  card,
  updateCard,
  dataPrivacyAccepted,
  setDataPrivacyAccepted,
  generateCards,
}: CardSelfServiceFormProps): ReactElement => {
  const { viewportSmall } = useWindowDimensions()
  const projectConfig = useContext(ProjectConfigContext)
  const [openDataPrivacy, setOpenDataPrivacy] = useState<boolean>(false)
  const [openReferenceInformation, setOpenReferenceInformation] = useState<boolean>(false)
  const cardValid = isValid(card, { expirationDateNullable: true })
  const cardCreationDisabled = !cardValid || !dataPrivacyAccepted

  return (
    <>
      <Container key={card.id}>
        <FormGroup label='Vorname Name'>
          <InputGroup
            large={viewportSmall}
            placeholder='Erika Musterfrau'
            autoFocus
            rightElement={
              <ClearInputButton
                viewportSmall={viewportSmall}
                onClick={() => updateCard({ fullName: '' })}
                input={card.fullName}
              />
            }
            intent={isFullNameValid(card) ? undefined : Intent.DANGER}
            value={card.fullName}
            onChange={event => updateCard({ fullName: event.target.value })}
          />
        </FormGroup>
        <ExtensionForms card={card} updateCard={updateCard} />
        <IconTextButton onClick={() => setOpenReferenceInformation(true)}>
          <InfoOutlined />
          Wo finde ich das Aktenzeichen?
        </IconTextButton>
        <StyledCheckbox checked={dataPrivacyAccepted} onChange={() => setDataPrivacyAccepted(!dataPrivacyAccepted)}>
          Ich akzeptiere die{' '}
          <UnderlineTextButton onClick={() => setOpenDataPrivacy(true)}>Datenschutzerklärung</UnderlineTextButton>.
        </StyledCheckbox>
      </Container>
      {cardCreationDisabled && (
        <StyledAlert variant='outlined' severity='warning'>
          {getTooltipMessage(cardValid, dataPrivacyAccepted)}
        </StyledAlert>
      )}
      <ActionButton onClick={generateCards} variant='contained' disabled={cardCreationDisabled} size='large'>
        KoblenzPass erstellen
      </ActionButton>
      <BasicDialog
        open={openReferenceInformation}
        maxWidth='lg'
        onUpdateOpen={setOpenReferenceInformation}
        title='Wo finde ich das Aktenzeichen?'
        content={
          <>
            Das Aktenzeichen finden Sie meist oben rechts auf dem postalischen Bescheid. Weitere Informationen und
            Beispiele finden Sie unter{' '}
            <a href='https://www.koblenz.de/koblenzpass' target='_blank' rel='noreferrer'>
              www.koblenz.de/koblenzpass
            </a>
            . <br />
            <br /> Bei Fragen dazu kontaktieren Sie uns bitte via{' '}
            <a href='mailto:koblenzpass@stadt.koblenz.de'>koblenzpass@stadt.koblenz.de</a>.
          </>
        }
      />
      <BasicDialog
        open={openDataPrivacy}
        maxWidth='md'
        onUpdateOpen={setOpenDataPrivacy}
        title={projectConfig.dataPrivacyHeadline}
        content={<projectConfig.dataPrivacyContent />}
      />
    </>
  )
}

export default CardSelfServiceForm
