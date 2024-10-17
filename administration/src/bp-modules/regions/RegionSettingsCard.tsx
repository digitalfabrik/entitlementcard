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
  onSave,
  loading,
  defaultApplicationActivation,
  defaultConfirmationMailActivation,
}: {
  onSave: (activatedForApplication: boolean, activatedForConfirmationMail: boolean) => void
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
        label='Nach der Erstellung einer Karte verschickt das System eine E-Mail-Bestätigung an den Antragsstellenden mit einem Link zur Vorab-Aktivierung'
      />
      <ButtonContainer>
        <Button
          text='Speichern'
          intent='primary'
          onClick={() => onSave(activatedForApplication, activatedForCardConfirmationMail)}
          loading={loading}
        />
      </ButtonContainer>
    </SettingsCard>
  )
}

export default RegionSettingsCard
