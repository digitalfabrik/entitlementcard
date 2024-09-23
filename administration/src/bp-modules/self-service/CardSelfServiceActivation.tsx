import { Typography } from '@mui/material'
import React, { ReactElement, useContext } from 'react'

import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'

const CardSelfServiceActivation = (): ReactElement => {
  const { name, activation } = useContext(ProjectConfigContext)
  return (
    <div>
      <div>Ihr {name} wurde erfolgreich erstellt.</div>
      <br />

      <Typography variant='h6'>PDF Download</Typography>
      <ul>
        <li>
          {' '}
          Sie können nun ihren {name} als PDF herunterladen, falls die den {name} auch in gedruckter Form nutzen
          möchten.
        </li>
        <li>
          {' '}
          Außerdem enthält das PDF auch ihren Aktivierungscode mit dem Sie falls Sie ihr Smartphone verlieren ihren{' '}
          {name} erneut erstellen Aktivieren können.
        </li>
        <li> Bewahren Sie dieses Dokument gut auf.</li>
      </ul>

      <Typography variant='h6'>Pass Aktivierung</Typography>

      <ol>
        <li>
          Stellen Sie sicher, dass sie die App <b>{name}</b> aus App- oder PlayStore auf Ihrem Smartphone installiert
          haben.
        </li>
        <li>
          Andernfalls: Laden Sie sich die App <b>{name}</b> im App- oder PlayStore auf Ihrem Smartphone herunter.
        </li>
        <li>
          {' '}
          Öffnen Sie dafür den folgenden Link auf Ihrem Smartphone:
          <br />
          <a href={activation?.downloadLink} target='_blank' rel='noreferrer'>
            {activation?.downloadLink}
          </a>
        </li>
        <li>
          Klicken sie auf <b>Pass aktivieren</b>.
        </li>
      </ol>
    </div>
  )
}

export default CardSelfServiceActivation
