const InvalidLinkTemplate = () => (
  <>
    <span>Der Link zum Zurücksetzen Ihres Passwortes ist ungültig. Mögliche Gründe:</span>
    <ul>
      <li>
        Der Link ist abgelaufen. Sie können
        <a href={window.location.origin + '/forgot-password'} rel='noreferrer'>
          {' '}
          hier{' '}
        </a>
        einen neuen Link erhalten
      </li>
      <li>
        Der Link wurde fehlerhaft in den Browser übertragen. Versuchen Sie, den Link manuell aus der Email in die
        Adresszeile Ihres Browsers zu kopieren
      </li>
      <li>Sie haben Ihr Passwort mithilfe des Links bereits zurückgesetzt</li>
      <li>Sie haben einen weiteren Link angefordert. Es ist immer nur der aktuellste Link gültig.</li>
    </ul>
  </>
)
export default InvalidLinkTemplate
