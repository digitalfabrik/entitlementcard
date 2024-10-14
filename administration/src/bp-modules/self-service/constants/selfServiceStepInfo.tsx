import React, { ReactElement } from 'react'

type SelfServiceStepInfo = {
  stepNr: number
  headline: string
  subHeadline: string
  text: ReactElement
}

const selfServiceStepInfo: SelfServiceStepInfo[] = [
  {
    stepNr: 1,
    headline: 'Herzlich Willkommen!',
    subHeadline: 'In wenigen Schritten zu Ihrem eigenen KoblenzPass.',
    text: (
      <span>
        {' '}
        Um Ihren Pass zu aktivieren bzw. Ihr Antrags-PDF herunterladen zu können, benötigen wir noch ein paar
        Informationen von Ihnen.
      </span>
    ),
  },
  {
    stepNr: 2,
    headline: 'Ihr KoblenzPass wurde erstellt.',
    subHeadline: 'Nur noch ein paar Klicks, bis Sie alle Vorteile nutzen zu können.',
    text: (
      <span>
        Haben Sie die App noch nicht? <b>Laden Sie sie jetzt herunter, um fortzufahren.</b>
      </span>
    ),
  },
  {
    stepNr: 3,
    headline: 'Letzte Schritte',
    subHeadline: 'AntragsPDF herunterladen und Pass aktivieren.',
    text: (
      <span>
        Laden Sie Ihre Antrags-PDF herunter, um Ihren Pass <b>im Falle eines Verlusts erneut aktivieren</b> zu können.
        Sie können den Pass so außerdem auch <b>in gedruckter Form nutzen</b>.
      </span>
    ),
  },
]

export default selfServiceStepInfo
