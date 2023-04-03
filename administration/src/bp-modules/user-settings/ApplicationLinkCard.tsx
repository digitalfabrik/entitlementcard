import { Button, Card, H2 } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

const ApplicationLinkCard = (): ReactElement => {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Card style={{ maxWidth: '500px' }}>
        <H2>Ehrenamtskarte beantragen</H2>
        <p>
          Aktuell ist das neue Beantragungsformular der Ehrenamtskarte nur intern für Testzwecke zugänglich. Hier
          gelangen sie zum Beantragungsformular der Ehrenamtskarte.
        </p>
        <div style={{ textAlign: 'right', padding: '10px 0' }}>
          <Button text='Beantragen' intent='primary' onClick={() => navigate('/beantragen')} />
        </div>
      </Card>
    </div>
  )
}

export default ApplicationLinkCard
