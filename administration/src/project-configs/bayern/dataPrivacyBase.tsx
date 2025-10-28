import { Link, Typography } from '@mui/material'
import React, { ReactElement } from 'react'

export const dataPrivacyBaseHeadline =
  'Datenschutzerklärung für die Nutzung und Beantragung der digitalen bayerischen Ehrenamtskarte'

/* Generated using https://magic.reactjs.net/htmltojsx.htm
Instructions:
Generate an HTML file from the Word document in OnlyOffice.
Open a console in your favorite web browser.
Copy html into a JS variable `s`:

let s = `{paste here}`

let r = s.replaceAll(/mso-([^;"])*;?/g, "")
 .replaceAll(/tab-stops([^;"])*;?/g, "")
 .replaceAll(/margin-left([^;"])*;?/g, "")
 .replaceAll(/padding-left([^;"])*;?/g, "")
 .replaceAll(/text-indent([^;"])*;?/g, "")
 .replaceAll(/color:#000000;?/g, "")
 .replaceAll(/font-family:'Times New Roman';?/g, "")
 .replaceAll(/font-size:12pt;?/g, "")
 .replaceAll(/line-height:normal;?/g, "")
 .replaceAll(/border:none;?/g, "")
 .replaceAll(/border-left:none;?/g, "")
 .replaceAll(/border-top:none;?/g, "")
 .replaceAll(/border-right:none;?/g, "")
 .replaceAll(/border-bottom:none;?/g, "")
 .replaceAll(/list-style-type: ?disc;?/g, "")
 .replaceAll(/ style=""/g, "")
 .replaceAll(/.*<body>/g, "<div>")
 .replaceAll(/<\/body><\/html>/g, "</div>")
 .replaceAll(/{{Variable Dritte}}/g, "")
 .replaceAll(/<br\/><span>&nbsp;<\/span>/g, "<br/>")
 .replaceAll(/<span><br\/><\/span>/g, "<br/>")
 .replaceAll(/<span>([^<]*)<\/span>/g, (g,h)=>h)
 .replaceAll(/<a/g, "<a target=\"_blank\" rel=\"noreferrer\"")
// Remove first paragraph with headline
r.substr(0, r.search("<p")) + r.substr(r.search("</p>") + 4)

Copy the resulting string into the htmltojsx converter.
*/

export const DataPrivacyBaseText = (): ReactElement => (
  <div>
    <Typography component='p' marginTop={1}>
      Diese Datenschutzerklärung bezieht sich auf die Verarbeitung personenbezogener Daten im Rahmen der digitalen
      bayerischen Ehrenamtskarte einschließlich verbundener Dienste.
    </Typography>
    <Typography component='p' marginTop={1}>
      Die digitale bayerische Ehrenamtskarte wird im Auftrag des Bayerischen Staatsministeriums für Familie, Arbeit und
      Soziales, Winzererstraße 9, 80797 München&nbsp;durch die Tür an Tür – Digitalfabrik gGmbH, Wertachstr. 29, 86153
      Augsburg betrieben.
    </Typography>
    <Typography component='p' marginTop={1}>
      Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre
      personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser
      Datenschutzerklärung.{' '}
    </Typography>
    <Typography component='p' marginTop={1}>
      Der gesamte Programmcode der digitalen bayerischen Ehrenamtskarte ist darüber hinaus quelloffen lizenziert unter
      der MIT-Lizenz und kann hier eingesehen werden:{' '}
      <Link
        target='_blank'
        rel='noreferrer'
        href='https://github.com/digitalfabrik/entitlementcard'
        title='https://github.com/digitalfabrik/entitlementcard'>
        https://github.com/digitalfabrik/entitlementcard
      </Link>
    </Typography>
    <Typography component='p' marginTop={1}>
      Für nähere Informationen zur Verarbeitung Ihrer personenbezogenen Daten können Sie uns unter den unten genannten
      Kontaktdaten erreichen.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Verantwortlich für den Inhalt:
      </Typography>
      <br />
      Referat III 3
      <br />
      Telefon: 089 1261-01
      <br />
      E-Mail:{' '}
      <Link
        target='_blank'
        rel='noreferrer'
        href='mailto:Poststelle@stmas.bayern.de'
        title='mailto:Poststelle@stmas.bayern.de'>
        Poststelle@stmas.bayern.de
      </Link>
      &nbsp;
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Kontaktdaten der Datenschutzbeauftragten
      </Typography>
      <br />
      Bayerisches Staatsministerium für Familie, Arbeit und Soziales
      <br />
      Herr Maurice Said
      <br />
      Winzererstr. 9<br />
      <span>
        80797 München
        <br />
      </span>
      E-Mail:{' '}
      <Link
        target='_blank'
        rel='noreferrer'
        href='mailto:Datenschutz@stmas.bayern.de'
        title='mailto:Datenschutz@stmas.bayern.de'>
        Datenschutz@stmas.bayern.de
      </Link>
      <br />
      Telefon: 089 1261 1445
    </Typography>
    <Typography component='p' margin={0}>
      Allgemeines zum Thema Datenschutz finden Sie auf der Website des Bayerischen Landesbeauftragten für den
      Datenschutz (
      <Link
        target='_blank'
        rel='noreferrer'
        href='https://www.datenschutz-bayern.de'
        title='https://www.datenschutz-bayern.de'>
        https://www.datenschutz-bayern.de
      </Link>
      ).{' '}
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Zwecke und Rechtsgrundlagen für die Verarbeitung personenbezogener Daten
      </Typography>
      <br />
    </Typography>
    <Typography component='p' marginTop={1}>
      Zweck der Verarbeitung ist die Erfüllung der uns vom Gesetzgeber zugewiesenen öffentlichen Aufgaben, insbesondere
      der Information der Öffentlichkeit im Bereich des Ehrenamts in Bayern.
    </Typography>
    <Typography component='p' marginTop={1}>
      Die Rechtsgrundlage für die Verarbeitung Ihrer Daten ergibt sich, soweit nichts anderes angegeben ist, aus Art. 4
      Abs. 1 des Bayerischen Datenschutzgesetzes (BayDSG) in Verbindung mit Art. 6 Abs. 1 UAbs. 1 Buchst. e der
      Datenschutzgrundverordnung (DSGVO). Demnach ist es uns erlaubt, die zur Erfüllung einer uns obliegenden Aufgabe
      erforderlichen Daten zu verarbeiten.&nbsp;
    </Typography>
    <Typography component='p' marginTop={1}>
      Soweit Sie in eine Verarbeitung eingewilligt haben, stützt sich die Datenverarbeitung auf Art. 6 Abs. 1 UAbs. 1
      Buchstabe a DSGVO.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Automatische Speicherung von Daten
      </Typography>
      <br />
      Bei jedem Zugriff auf das Antragsformular (
      <Link
        target='_blank'
        rel='noreferrer'
        href='https://bayern.ehrenamtskarte.app/beantragen'
        title='https://bayern.ehrenamtskarte.app/beantragen'>
        https://bayern.ehrenamtskarte.app/beantragen
      </Link>
      ) oder die Nutzung der bayerischen Ehrenamtskarten-App (Android/iOS) werden folgende Nutzungsdaten gemäß § 15 Abs.
      1 TMG bei jedem Aufruf mit aktiver Internetverbindung anonymisiert erhoben:
    </Typography>
    <Typography component='ul'>
      <Typography component='li' marginTop={1}>
        Datum und Uhrzeit des Abrufs
      </Typography>

      <Typography component='li' marginTop={1}>
        Name des aufgerufenen Internetdienstes, der aufgerufenen Ressource und der verwendeten Aktion
      </Typography>

      <Typography component='li' marginTop={1}>
        vollständige IP-Adresse des anfordernden Rechners
      </Typography>

      <Typography component='li' marginTop={1}>
        Abfrage, die der Client gestellt hat
      </Typography>

      <Typography component='li' marginTop={1}>
        übertragene Datenmenge
      </Typography>

      <Typography component='li' marginTop={1}>
        Meldung, ob der Abruf erfolgreich war
      </Typography>

      <Typography component='li' marginTop={1}>
        Browser-Identifikation (enthält in der Regel die Browserversion, sowie das Betriebssystem)
      </Typography>

      <Typography component='li' marginTop={1}>
        Innerhalb der App eingegebene Suchen nach Adressen oder Vergünstigungen;
      </Typography>

      <Typography component='li' marginTop={1}>
        Standort-Positionen, falls der Standort in den Apps freigegeben ist.
      </Typography>
    </Typography>
    <Typography component='p' margin={0}>
      Sonstige Daten werden bei Ihrer Nutzung nicht automatisch erhoben und nicht an unsere Server gesendet. Nach dem
      Grundsatz der Datenvermeidung und der Datensparsamkeit sowie dem Grundsatz der anonymen und pseudonymen Nutzung
      wird nur das Minimum an Nutzungsdaten erhoben, soweit dies für den technischen Betrieb der Apps sowie die
      Ermittlung der aufgerufenen Inhalte erforderlich ist.&nbsp;Die erhobenen Informationen können weder direkt noch
      mit Hilfe von Zusatzwissen auf eine bestimmte Person zurückgeführt werden. Die einzelnen Nutzerinnen und Nutzer
      können somit nicht identifiziert werden. Wir erstellen keine Nutzungsprofile.
    </Typography>
    <Typography component='p' margin={0}>
      &nbsp;
    </Typography>
    <Typography component='p' margin={0}>
      Zur Gewährleistung des technischen Betriebs wird die IP-Adresse für 14 Tage in den Serverprotokollen gespeichert
      und danach gelöscht.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Weitergabe erhobener Daten
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Der technische Betrieb unserer Datenverarbeitungssysteme erfolgt durch:
    </Typography>
    <Typography component='p' marginTop={1}>
      Tür an Tür – Digitalfabrik gGmbH,
      <br />
      Wertachstr. 29,
      <br />
      86153 Augsburg
    </Typography>
    <Typography component='p' marginTop={1}>
      Gegebenenfalls werden Ihre Daten an die zuständigen Aufsichts- und Rechnungsprüfungsbehörden zur Wahrnehmung der
      jeweiligen Kontrollrechte übermittelt.
    </Typography>
    <Typography component='p' marginTop={1}>
      Zur Abwehr von Gefahren für die Sicherheit in der Informationstechnik können bei elektronischer Übermittlung Daten
      an das Landesamt für Sicherheit in der Informationstechnik weitergeleitet werden und dort auf Grundlage der Art.
      12 ff. des Bayerischen E-Government-Gesetzes verarbeitet werden.&nbsp;Ihre Daten werden an das Bayerische
      Staatsministerium für Familie, Arbeit und Soziales sowie die ausstellende Stadt- bzw. Kreisverwaltung an Ihrem im
      Antrag angegebenen Hauptwohnsitz weitergegeben, um die Ehrenamtskarte sachgemäß auszustellen. &nbsp;Sollte die
      zuständige Stadt- bzw. Kreisverwaltung Ihre Daten auch an weitere Dritte (z.B. externe Druckereien) weitergeben,
      sind diese im Abschnitt „Weitergabe der Daten an externe Dritte“ aufgeführt.
    </Typography>
    <Typography component='p' margin={0}>
      Eine Übermittlung der Daten in andere Staaten erfolgt nicht. Der Serverstandort ist Deutschland.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Zustimmung (Einwilligung) zur Erhebung, Nutzung und Verarbeitung personenbezogener Daten
      </Typography>
      <br />
      Außerhalb gesetzlicher Verpflichtungen dürfen personenbezogene Daten nur mit (und im Rahmen) Ihrer Zustimmung
      erhoben, genutzt oder verarbeitet werden. Um dies zu gewährleisten, müssen Sie z.B. bei der Beantragung der
      digitalen bayerischen Ehrenamtskarte explizit der Verarbeitung und Weitergabe Ihrer Daten zustimmen. Sollten Sie
      die digitale bayerische Ehrenamtskarte über das Online-Formular auf (
      <Link
        target='_blank'
        rel='noreferrer'
        href='https://bayern.ehrenamtskarte.app/beantragen'
        title='https://bayern.ehrenamtskarte.app/beantragen'>
        https://bayern.ehrenamtskarte.app/beantragen
      </Link>
      ) beantragen, wird die Tür an Tür – Digitalfabrik gGmbH die im Antragsformular angegebenen Daten erheben,
      verarbeiten und nutzen. Dies erfolgt ausschließlich für den Zweck der Ausstellung der Bayerischen Ehrenamtskarte,
      sowie der damit verbundenen Gewährung von Vergünstigungen und zugehörigen Kommunikationsmaßnahmen.{' '}
    </Typography>
    <Typography component='p' marginTop={1}>
      Beim Zugriff auf dieses Internetangebot werden von uns Cookies (kleine Dateien) auf Ihrer Festplatte mit einer
      Gültigkeitsdauer von zwölf Monaten gespeichert. Wir verwenden diese ausschließlich dazu, Sie bei diesem und
      weiteren Besuchen unserer Webseite wiedererkennen zu können. Die meisten Browser sind so eingestellt, dass sie die
      Verwendung von Cookies akzeptieren, diese Funktion kann aber durch die Einstellung des Internetbrowsers von Ihnen
      für die laufende Sitzung oder dauerhaft abgeschaltet werden.“
    </Typography>
    <Typography component='p' marginTop={1}>
      Alle Einwilligungen können verweigert bzw. jederzeit ohne Angabe von Gründen durch Mitteilung an
      digitalfabrik@tuerantuer.de widerrufen werden. In diesem Fall werden alle gespeicherten personenbezogenen Daten
      gelöscht und die Ehrenamtskarte verliert ihre Gültigkeit. Aus der Nicht-Einwilligung oder einem Widerruf darf
      Ihnen kein Nachteil entstehen. Ein Widerruf kann nur mit Wirkung für die Zukunft erklärt werden.{' '}
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Einwilligung durch Minderjährige
      </Typography>
      <br />
      Personenbezogene Daten von Minderjährigen unter 16 Jahren werden nicht bewusst erhoben und verarbeitet., da die
      digitale bayerische Ehrenamtskarte erst ab 16 Jahren beantragt werden kann.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Dauer der Speicherung der personenbezogenen Daten
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Ihre Daten werden nur so lange gespeichert, wie dies unter Beachtung gesetzlicher Aufbewahrungsfristen zur
      Aufgabenerfüllung erforderlich ist.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Ihre Rechte
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Soweit wir von Ihnen personenbezogene Daten verarbeiten, stehen Ihnen als Betroffener nachfolgende Rechte zu:
    </Typography>
    <Typography component='ul'>
      <Typography component='li' marginTop={1}>
        Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO).
      </Typography>

      <Typography component='li' marginTop={1}>
        Sollten unrichtige personenbezogene Daten verarbeitet werden, steht Ihnen ein Recht auf Berichtigung zu (Art. 16
        DSGVO).
      </Typography>

      <Typography component='li' marginTop={1}>
        Liegen die gesetzlichen Voraussetzungen vor, so können Sie die Löschung oder Einschränkung der Verarbeitung
        verlangen (Art. 17 und 18 DSGVO).
      </Typography>

      <Typography component='li' marginTop={1}>
        Wenn Sie in die Verarbeitung eingewilligt haben oder ein Vertrag zur Datenverarbeitung besteht und die
        Datenverarbeitung mithilfe automatisierter Verfahren durchgeführt wird, steht Ihnen gegebenenfalls ein Recht auf
        Datenübertragbarkeit zu (Art. 20 DSGVO).
      </Typography>

      <Typography component='li' marginTop={1}>
        Falls Sie in die Verarbeitung eingewilligt haben und die Verarbeitung auf dieser Einwilligung beruht, können Sie
        die Einwilligung jederzeit für die Zukunft widerrufen. Die Rechtmäßigkeit der aufgrund der Einwilligung bis zum
        Widerruf erfolgten Datenverarbeitung wird durch diesen nicht berührt.{' '}
      </Typography>

      <Typography component='li' marginTop={1}>
        Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die
        Verarbeitung Ihrer Daten Widerspruch einzulegen, wenn die Verarbeitung ausschließlich auf Grundlage des Art. 6
        Abs. 1 UAbs. 1 Buchst. e oder f DSGVO erfolgt (Art. 21 Abs. 1 Satz 1 DSGVO).
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Beschwerderecht bei der Aufsichtsbehörde
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Weiterhin besteht ein Beschwerderecht beim Bayerischen Landesbeauftragten für den Datenschutz. Diesen können Sie
      unter folgenden Kontaktdaten erreichen:
    </Typography>
    <Typography component='p' marginTop={1}>
      Postanschrift: Postfach 22 12 19, 80502 München
      <br />
      Adresse:&nbsp; Wagmüllerstraße 18, 80538 München
      <span>
        <br />
        Telefon:&nbsp; (089) 2126-72-0
      </span>
      <span>
        <br />
        Telefax:&nbsp; (089) 2126-72-50
      </span>
      <br />
      Internet: www.datenschutz-bayern.de
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Datensicherheit
      </Typography>
      <br />
      Wir verwenden technische und organisatorische Maßnahmen, um Ihre Daten vor dem Zugriff Unberechtigter und vor
      Manipulation, Übermittlung, Verlust oder Zerstörung zu schützen. Unsere Sicherheitsverfahren überprüfen wir
      regelmäßig und passen sie dem technologischen Fortschritt an.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Offenlegung und Weitergabe personenbezogener Daten
      </Typography>
      <br />
      Alle personenbezogenen Daten werden ausschließlich mit Ihrer ausdrücklichen Zustimmung weitergegeben und werden
      für keine anderen Zwecke als die in unserer Datenschutzerklärung genannten, verwendet.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Datenerhebung, Datennutzung und Verarbeitung
      </Typography>
      <br />
      <Typography variant='body2bold' component='span'>
        Elektronische Datenerhebung innerhalb des Webangebotes
      </Typography>
      <br />
      Wenn Sie innerhalb unserer Online-Dienste aufgefordert werden personenbezogene Daten einzugeben, erfolgt deren
      Transport über das Internet unter Verwendung von SSL-Verschlüsselung, um Ihre Daten vor einer Kenntnisnahme durch
      Unbefugte zu schützen.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Elektronische Post (E-Mail)
      </Typography>
      <br />
      Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail)
      Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht
      möglich.&nbsp;Wenn Sie uns E-Mails senden, wird Ihre E-Mail-Adresse nur für die Korrespondenz mit Ihnen verwendet.
      Informationen, die Sie unverschlüsselt per E-Mail an uns senden können, möglicherweise auf dem Übertragungsweg von
      Dritten gelesen werden.{' '}
    </Typography>
    <div>
      <Typography variant='body2bold' component='span'>
        Weitergabe der Daten an externe Dritte
      </Typography>
    </div>
  </div>
)

export const DataPrivacyAdditionalBaseText = (): ReactElement => (
  <div>
    <Typography component='span'>Es erfolgt keine Weitergabe der Daten an Dritte.</Typography>
  </div>
)
