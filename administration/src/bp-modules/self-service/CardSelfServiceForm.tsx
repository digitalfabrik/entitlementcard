import { Checkbox, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Alert, styled } from '@mui/material'
import React, { ChangeEvent, ReactElement, useContext, useState } from 'react'

import CardBlueprint from '../../cards/CardBlueprint'
import ClearInputButton from '../../cards/extensions/components/ClearInputButton'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import BasicDialog from '../../mui-modules/application/BasicDialog'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ExtensionForm } from '../cards/AddCardForm'
import { ActionButton } from './components/ActionButton'
import { IconTextButton } from './components/IconTextButton'

const PrivacyButton = styled('button')`
  border: none;
  background-color: transparent;
  color: blue;
  text-decoration: underline;
  padding: 0;
  cursor: pointer;
`

const StyledCheckbox = styled(Checkbox)`
  margin-top: 24px;
  font-size: 16px;
  margin-left: 4px;
`

const StyledAlert = styled(Alert)`
  margin-bottom: 24px;
`

const Container = styled('div')`
  margin-bottom: 24px;
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
    tooltipMessages.push('Bitte akzeptieren Sie die Datenschutzerklärung.')
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
  const [openReferenceInformation, setOpenReferenceInformation] = useState<boolean>(false)
  const cardValid = card.isValid()
  const cardCreationDisabled = !cardValid || !dataPrivacyAccepted
  const clearNameInput = () => {
    card.fullName = ''
    notifyUpdate()
  }

  return (
    <>
      <Container key={card.id}>
        <FormGroup label='Name'>
          <InputGroup
            large={viewportSmall}
            placeholder='Erika Mustermann'
            autoFocus
            rightElement={
              <ClearInputButton viewportSmall={viewportSmall} onClick={clearNameInput} input={card.fullName} />
            }
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
        <IconTextButton onClick={() => setOpenReferenceInformation(true)}>
          <InfoOutlined />
          Informationen zur Referenznummer
        </IconTextButton>
        <StyledCheckbox checked={dataPrivacyAccepted} onChange={() => setDataPrivacyAccepted(!dataPrivacyAccepted)}>
          Ich akzeptiere die{' '}
          <PrivacyButton onClick={() => setOpenDataPrivacy(true)}>Datenschutzerklärung</PrivacyButton>.
        </StyledCheckbox>
      </Container>
      {cardCreationDisabled && (
        <StyledAlert variant='outlined' severity='warning'>
          {getTooltipMessage(cardValid, dataPrivacyAccepted)}
        </StyledAlert>
      )}
      <ActionButton onClick={generateCards} variant='contained' disabled={cardCreationDisabled} size='large'>
        Pass erstellen
      </ActionButton>
      <BasicDialog
        open={openReferenceInformation}
        maxWidth='lg'
        onUpdateOpen={setOpenReferenceInformation}
        title={'Informationen zur Referenznummer'}
        content={<>Waiting for information...</>}
      />
      <BasicDialog
        open={openDataPrivacy}
        maxWidth='md'
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
