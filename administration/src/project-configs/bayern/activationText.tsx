import { Typography } from '@mui/material'
import React from 'react'

export const ActivationText = (applicationName: string, downloadLink: string) => (
  <div>
    <Typography variant='h6' mb='8px'>
      App nicht installiert
    </Typography>
    Laden Sie sich die App <b>{applicationName}</b> im App- oder PlayStore auf Ihrem Smartphone herunter.
    <br />
    Öffnen Sie dafür den folgenden Link auf ihrem Smartphone:
    <br />
    <a href={downloadLink} target='_blank' rel='noreferrer'>
      {downloadLink}
    </a>{' '}
    <br />
    Nach erfolgreicher Installation können sie die Karte aktivieren.
  </div>
)
