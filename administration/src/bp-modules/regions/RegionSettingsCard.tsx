import { Button, Checkbox, H2 } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'
import styled from 'styled-components'

import SettingsCard from '../user-settings/SettingsCard'

const ButtonContainer = styled.div`
  text-align: right;
  padding: 10px 0;
`

const Headline = styled(H2)`
  margin-bottom: 16px;
`

const RegionSettingsCard = ({
  onUpdate,
  loading,
  defaultApplicationActivation,
  defaultConfirmationMailActivation,
}: {
  onUpdate: (activatedForApplication: boolean, activatedForConfirmationMail: boolean) => void
  loading: boolean
  defaultApplicationActivation: boolean
  defaultConfirmationMailActivation: boolean
}): ReactElement => {
  const [activatedForApplication, setActivatedForApplication] = useState<boolean>(defaultApplicationActivation)
  const [activatedForCardConfirmationMail, setActivatedForCardConfirmationMail] = useState<boolean>(
    defaultConfirmationMailActivation
  )

  return (
    <SettingsCard>
      <Headline>Regionsspezifische Einstellungen</Headline>
      <Checkbox
        checked={activatedForApplication}
        onChange={e => setActivatedForApplication(e.currentTarget.checked)}
        label='Region ist für den neuen Beantragungsprozess freigeschaltet'
      />
      <Checkbox
        checked={activatedForCardConfirmationMail}
        onChange={e => setActivatedForCardConfirmationMail(e.currentTarget.checked)}
        label='Benachrichtigung über erfolgte Kartenerstellung wird an den Antragssteller versendet'
      />
      <ButtonContainer>
        <Button
          text={'Speichern'}
          intent={'primary'}
          onClick={() => onUpdate(activatedForApplication, activatedForCardConfirmationMail)}
          loading={loading}
        />
      </ButtonContainer>
    </SettingsCard>
  )
}

export default RegionSettingsCard
