import React, { ReactElement } from 'react'

const InvalidLink = (): ReactElement => (
  <>
    <span>Der von Ihnen geöffnete Link ist ungültig. Mögliche Gründe:</span>
    <ul>
      <li>
        Der Link wurde fehlerhaft in den Browser übertragen. Versuchen Sie, den Link manuell aus der Email in die
        Adresszeile Ihres Browsers zu kopieren.
      </li>
      <li>
        Für Antragsstellerinnen und Antragssteller: Ihr Antrag wurde bewilligt und die Karte befindet sich nun in der
        Erstellung bzw. im Versand zu Ihnen. Die Erstellung und der Versand der Karte kann einige Wochen in Anspruch
        nehmen. Falls Sie keine Karte erhalten, wenden Sie sich bitte an Ihre zuständige Behörde.
      </li>
      <li>
        Für Organisationen des ehrenamtlichen Engagements: Der Antrag wurde bereits abschließend bearbeitet oder von
        Ihnen genehmigt/abgelehnt.
      </li>
      <li>Die Berechtigungen für den Erhalt der Karte waren nicht erfüllt und Ihr Antrag wurde gelöscht.</li>
    </ul>
  </>
)
export default InvalidLink
