import { Button, Typography, styled } from '@mui/material'
import React from 'react'

const ActivationButton = styled(Button)`
  margin-top: 12px;
  :hover {
    color: white;
  }
`

export const ActivationText = (applicationName: string, downloadLink: string, deepLink: string) => (
  <div>
    <Typography variant='h6' mb='8px'>
      Aktivierung nur in der App möglich
    </Typography>
    <span>
      Falls sie die App Ehrenamtskarte installiert haben und sich dennoch ihr Browser geöffnet hat, nutzen Sie bitte
      diese Schaltfläche zur Aktivierung: <br />{' '}
      <ActivationButton href={deepLink} variant='contained' size='small'>
        Karte aktivieren
      </ActivationButton>
      <br /> <br />
      <b>Andernfalls befolgen Sie diese Schritte:</b>
    </span>
    <ol>
      <li>
        Laden Sie sich die App <b>{applicationName}</b> im App- oder PlayStore auf Ihrem Smartphone herunter.
      </li>
      <li>
        {' '}
        Öffnen Sie dafür den folgenden Link auf Ihrem Smartphone:
        <br />
        <a href={downloadLink} target='_blank' rel='noreferrer'>
          {downloadLink}
        </a>
      </li>
      <li>
        Öffnen Sie nach erfolgreicher Installation die PDF mit dem Aktivierungscode und führen Sie die Aktivierung
        erneut durch. Gegebenenfalls müssen Sie dabei die heruntergeladene App auswählen, um den Vorgang in der App zu
        starten.
      </li>
    </ol>
  </div>
)
