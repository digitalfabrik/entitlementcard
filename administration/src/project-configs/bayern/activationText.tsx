import { Typography } from '@mui/material'
import React from 'react'

export const ActivationText = (applicationName: string, downloadLink: string) => (
  <div>
    <Typography variant='h6' mb='8px'>
      App nicht installiert
    </Typography>
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
        erneut durch. Gegebenenfalls müssen Sie dabei die heruntergeladene App auswählen, um den Vorgang in der App zu starten.
      </li>
    </ol>
  </div>
)
