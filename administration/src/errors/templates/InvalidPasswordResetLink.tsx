import React, { ReactElement } from 'react'

const InvalidPasswordResetLink = (): ReactElement => (
  <>
    <span>Der von Ihnen geöffnete Link ist ungültig. Mögliche Gründe:</span>
    <ul>
      <li>
        Der Link wurde fehlerhaft in den Browser übertragen. Versuchen Sie, den Link manuell aus der Email in die
        Adresszeile Ihres Browsers zu kopieren.
      </li>
      <li>Sie haben Ihr Passwort mithilfe des Links bereits zurückgesetzt.</li>
      <li>Sie haben einen weiteren Link angefordert. Es ist immer nur der aktuellste Link gültig.</li>
    </ul>
  </>
)
export default InvalidPasswordResetLink
