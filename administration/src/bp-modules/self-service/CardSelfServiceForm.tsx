import { Checkbox, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import React, { ChangeEvent, ReactElement, useContext, useState } from 'react'
import styled from 'styled-components'

import CardBlueprint from '../../cards/CardBlueprint'
import BasicDialog from '../../mui-modules/application/BasicDialog'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import { ExtensionForm } from '../cards/AddCardForm'

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

type CardSelfServiceFormProps = {
  card: CardBlueprint
  notifyUpdate: () => void
  dataPrivacyAccepted: boolean
  setDataPrivacyAccepted: (value: boolean) => void
}
const CardSelfServiceForm = ({
  card,
  notifyUpdate,
  dataPrivacyAccepted,
  setDataPrivacyAccepted,
}: CardSelfServiceFormProps): ReactElement => {
  const projectConfig = useContext(ProjectConfigContext)
  const [openDataPrivacy, setOpenDataPrivacy] = useState<boolean>(false)
  return (
    <>
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
