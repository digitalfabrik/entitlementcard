import { Card, Checkbox, FormGroup, H4, InputGroup, Intent } from '@blueprintjs/core'
import React, { ChangeEvent, ReactElement, useContext, useState } from 'react'
import styled from 'styled-components'

import BasicDialog from '../../mui-modules/application/BasicDialog'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ExtensionForm } from '../cards/AddCardForm'
import useCardGeneratorSelfService from '../cards/hooks/useCardGeneratorSelfService'
import CardSelfServiceButtonBar from './CardSelfServiceButtonBar'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`

const StyledCard = styled(Card)`
  width: 100%;
`

const Headline = styled(H4)`
  display: flex;
  margin: 24px;
`

const PrivacyButton = styled.button`
  border: none !important;
  background-color: transparent;
  color: blue;
  text-decoration: underline;
  padding: 0;
  cursor: pointer;
`

// TODO use state and setState from useCardGenerator, remove ServiceController, clear CardBlueprint, show Message, convert array to object
// TODO process 1. show form ->Create card, 2.savePDF or activate card & show explanation
const CardSelfServiceForm = (): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const [dataPrivacyAccepted, setDataPrivacyAccepted] = useState<boolean>(false)
  const [openDataPrivacy, setOpenDataPrivacy] = useState<boolean>(false)
  const { generateCards, setCardBlueprint, cardBlueprint, deepLink, code, region, downloadPdf } =
    useCardGeneratorSelfService()

  const notifyUpdate = () => {
    // TODO fix reassigning functions when using object instead array
    setCardBlueprint([...cardBlueprint])
  }

  const card = cardBlueprint[0]

  const onDownloadPdf = async () => {
    if (code && region) {
      await downloadPdf(code, region)
    }
  }

  return (
    <Container>
      <Headline>{projectConfig.name} Beantragung</Headline>
      <StyledCard>
        <div key={card.id}>
          <FormGroup label='Name'>
            <InputGroup
              placeholder='Erika Mustermann'
              autoFocus
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
            <ExtensionForm key={i} extension={ext} onUpdate={notifyUpdate} />
          ))}
          <Checkbox checked={dataPrivacyAccepted} onChange={() => setDataPrivacyAccepted(!dataPrivacyAccepted)}>
            Ich akzeptiere die{' '}
            <PrivacyButton onClick={() => setOpenDataPrivacy(true)}>Datenschutzerklärung</PrivacyButton>.
          </Checkbox>
        </div>
      </StyledCard>
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
      <CardSelfServiceButtonBar
        downloadPdf={onDownloadPdf}
        generateCards={generateCards}
        cardBlueprint={card}
        dataPrivacyAccepted={dataPrivacyAccepted}
        deepLink={deepLink}
      />
    </Container>
  )
}

export default CardSelfServiceForm
