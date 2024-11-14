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
        Um Ihren Pass zu aktivieren bzw. herunterladen zu können, benötigen wir noch zusätzliche Informationen von
        Ihnen.
      </span>
    ),
  },
  {
    stepNr: 2,
    headline: 'Ihr KoblenzPass wurde erstellt.',
    subHeadline: 'Nur noch ein paar Klicks, bis Sie alle Vorteile nutzen können.',
    text: (
      <span>
        <b>App bereits installiert? </b>Dann klicken Sie auf „Weiter zur Aktivierung“
      </span>
    ),
  },
  {
    stepNr: 3,
    headline: 'Fast geschafft!',
    subHeadline: 'KoblenzPass aktivieren und Backup herunterladen',
    text: (
      <span>
        Laden Sie den KoblenzPass als PDF-Datei herunter, um ihn{' '}
        <b>notfalls erneut in der App hinterlegen zu können. </b>
        Sie können den KoblenzPass so außerdem auch <b>ohne mobiles Endgerät nutzen</b>.
      </span>
    ),
  },
]

export default selfServiceStepInfo
