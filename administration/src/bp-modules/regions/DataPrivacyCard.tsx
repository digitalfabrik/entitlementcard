import { Button, H2 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import SettingsCard from '../user-settings/SettingsCard'

const DataPrivacyCard = (): ReactElement => {
  const navigate = useNavigate()
  return (
    <SettingsCard>
      <H2>Erweiterung der Datenschutzerklärung</H2>
      <p>
        Hier können Sie die allgemeine Datenschutzerklärung um Inhalte, die speziell für Ihre Region relevant sind,
        erweitern.
      </p>
      <div style={{ textAlign: 'right', padding: '10px 0' }}>
        <Button text='Öffnen' intent='primary' onClick={() => navigate('/region/data-privacy-policy')} />
      </div>
    </SettingsCard>
  )
}

export default DataPrivacyCard
