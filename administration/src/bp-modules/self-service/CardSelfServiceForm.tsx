import { Checkbox, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { styled } from '@mui/material'
import React, { ReactElement, useContext, useState } from 'react'

import { Card, getFullNameValidationErrorMessage, isFullNameValid, isValid } from '../../cards/Card'
import ClearInputButton from '../../cards/extensions/components/ClearInputButton'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import BasicDialog from '../../mui-modules/application/BasicDialog'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { useAppToaster } from '../AppToaster'
import ExtensionForms from '../cards/ExtensionForms'
import { DataPrivacyAcceptingStatus } from './CardSelfServiceView'
import { ActionButton } from './components/ActionButton'
import FormErrorMessage from './components/FormErrorMessage'
import { IconTextButton } from './components/IconTextButton'
import { UnderlineTextButton } from './components/UnderlineTextButton'

const StyledCheckbox = styled(Checkbox)`
  margin-top: 24px;
  font-size: 16px;
  margin-left: 4px;
`

const Container = styled('div')`
  margin-bottom: 24px;
`

type CardSelfServiceFormProps = {
  card: Card
  updateCard: (card: Partial<Card>) => void
  dataPrivacyAccepted: DataPrivacyAcceptingStatus
  setDataPrivacyAccepted: (status: DataPrivacyAcceptingStatus) => void
  generateCards: () => Promise<void>
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
  const appToaster = useAppToaster()

  const createKoblenzPass = async () => {
    if (cardValid && dataPrivacyAccepted === DataPrivacyAcceptingStatus.accepted) {
      await generateCards()
      return
    }
    if (dataPrivacyAccepted === DataPrivacyAcceptingStatus.untouched) {
      setDataPrivacyAccepted(DataPrivacyAcceptingStatus.denied)
    }
    appToaster?.show({
      message: (
        <FormErrorMessage style={{ color: 'white' }} errorMessage='Mindestens eine Ihrer Angaben ist ungültig.' />
      ),
      timeout: 0,
      intent: 'danger',
    })
  }

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
          <FormErrorMessage errorMessage={getFullNameValidationErrorMessage(card.fullName)} />
        </FormGroup>
        <ExtensionForms card={card} updateCard={updateCard} />
        <IconTextButton onClick={() => setOpenReferenceInformation(true)}>
          <InfoOutlined />
          Wo finde ich das Aktenzeichen?
        </IconTextButton>
        <StyledCheckbox
          checked={dataPrivacyAccepted === DataPrivacyAcceptingStatus.accepted}
          onChange={() =>
            setDataPrivacyAccepted(
              dataPrivacyAccepted === DataPrivacyAcceptingStatus.accepted
                ? DataPrivacyAcceptingStatus.denied
                : DataPrivacyAcceptingStatus.accepted
            )
          }>
          Ich akzeptiere die{' '}
          <UnderlineTextButton onClick={() => setOpenDataPrivacy(true)}>Datenschutzerklärung</UnderlineTextButton>.
        </StyledCheckbox>
        {dataPrivacyAccepted === DataPrivacyAcceptingStatus.denied && (
          <FormErrorMessage errorMessage='Bitte akzeptieren sie die Datenschutzerklärung' />
        )}
      </Container>
      <ActionButton onClick={createKoblenzPass} variant='contained' size='large'>
        KoblenzPass erstellen
      </ActionButton>
      <BasicDialog
        open={openReferenceInformation}
        maxWidth='lg'
        onUpdateOpen={setOpenReferenceInformation}
        title='Wo finde ich das Aktenzeichen?'
        content={
          <>
            Das Aktenzeichen finden Sie meist oben rechts auf dem postalischen Bescheid. <br />
            Weitere Informationen und Beispiele finden Sie unter{' '}
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
