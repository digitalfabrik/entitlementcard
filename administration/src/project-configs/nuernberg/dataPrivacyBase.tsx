import { Link, Typography } from '@mui/material'
import React, { ReactElement } from 'react'

export const dataPrivacyBaseHeadline =
  'Datenschutzerklärung für die Nutzung und Beantragung des digitalen Nürnberg-Pass'

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
 .replaceAll(/<a/g, "<a target=_blank rel=noreferrer")
// Remove first paragraph with headline
r.substr(0, r.search("<p")) + r.substr(r.search("</p>") + 4)

Copy the resulting string into the htmltojsx converter.
*/

export const DataPrivacyBaseText = (): ReactElement => (
  <div>
    <Typography component='p' marginTop={1}>
      Diese Datenschutzerklärung bezieht sich auf die Verarbeitung personenbezogener Daten im Rahmen des digitalen
      NürnbergPass einschließlich verbundener Dienste.
    </Typography>
    <Typography component='p' marginTop={1}>
      Der digitale NürnbergPass wird im Auftrag der Stadt Nürnberg, Amt für Existenzsicherung und soziale Integration,
      Dietzstraße 4, 90443 Nürnberg durch die Tür an Tür – Digitalfabrik gGmbH, Wertachstr. 29, 86153 Augsburg
      betrieben.
    </Typography>
    <Typography component='p' marginTop={1}>
      Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre
      personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser
      Datenschutzerklärung.
    </Typography>
    <Typography component='p' marginTop={1}>
      Der gesamte Programmcode des digitalen NürnbergPass ist darüber hinaus quelloffen lizenziert unter der MIT-Lizenz
      und kann hier eingesehen werden:
      <br />
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
        Name und Kontaktdaten des Verantwortlichen
      </Typography>
      &nbsp;
      <br />
      Stadt Nürnberg Sozialamt
      <br />
      <br />
      Amt für Existenzsicherung und soziale Integration – Sozialamt
      <Typography component='span'>Telefon: </Typography>
      0911 /231 - 2315
      <br />
      E-Mail:
      <Link target='_blank' rel='noreferrer' href='mailto:SHA@stadt.nuernberg.de' title='mailto:SHA@stadt.nuernberg.de'>
        <Typography component='span'>SHA@stadt.nuernberg.de</Typography>
      </Link>
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Für Fragen zum Datenschutz
      </Typography>
      <br />
      Stadt Nürnberg, Datenschutzbeauftragter
      <br />
      <br />
      Fünferplatz 2, 90403 Nürnberg
      <Typography component='span'>
        <br />
        Telefon:0911 / 231 - 5115
      </Typography>
      <Typography component='span'>
        <br />
        E-Mail:{' '}
      </Typography>
      <Link
        target='_blank'
        rel='noreferrer'
        href='mailto:Datenschutz@stadt.nuernberg.de'
        title='mailto:Datenschutz@stadt.nuernberg.de'>
        Datenschutz@stadt.nuernberg.de
      </Link>
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Zwecke und Rechtsgrundlagen für die Verarbeitung personenbezogener Daten
      </Typography>
      <Typography variant='body2bold' component='span'>
        <br />
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Zweck der Verarbeitung ist die Erfüllung der uns vom Gesetzgeber zugewiesenen öffentlichen Aufgaben, insbesondere
      der Bereitstellung von Sozialleistungen.
    </Typography>
    <Typography component='p' marginTop={1}>
      Die Rechtsgrundlage für die Verarbeitung Ihrer Daten ergibt sich, soweit nichts anderes angegeben ist, aus Art. 4
      Abs. 1 des Bayerischen Datenschutzgesetzes (BayDSG) in Verbindung mit Art. 6 Abs. 1 UAbs. 1 Buchst. e der
      Datenschutzgrundverordnung (DSGVO). Demnach ist es uns erlaubt, die zur Erfüllung einer uns obliegenden Aufgabe
      erforderlichen Daten zu verarbeiten.{' '}
    </Typography>
    <Typography component='p' marginTop={1}>
      Soweit Sie in eine Verarbeitung eingewilligt haben, stützt sich die Datenverarbeitung auf Art. 6 Abs. 1
      <Typography component='span'>&nbsp;</Typography>
      UAbs. 1 Buchstabe a DSGVO.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        <br />
        Automatische Speicherung von Daten
      </Typography>
      <Typography variant='body2bold' component='span'>
        <br />
      </Typography>
      Bei Nutzung der digitalen NürnbergPass-App (Android/iOS) werden folgende Nutzungsdaten gemäß § 15 Abs. 1 TMG bei
      jedem Aufruf mit aktiver Internetverbindung anonymisiert erhoben:
    </Typography>
    <Typography component='ul'>
      <Typography component='li'>Datum und Uhrzeit des Abrufs</Typography>

      <Typography component='li'>
        Name des aufgerufenen Internetdienstes, der aufgerufenen Ressource und der verwendeten Aktion
      </Typography>

      <Typography component='li'>vollständige IP-Adresse des anfordernden Rechners</Typography>

      <Typography component='li'>Abfrage, die der Client gestellt hat</Typography>

      <Typography component='li'>übertragene Datenmenge</Typography>

      <Typography component='li'>Meldung, ob der Abruf erfolgreich war</Typography>

      <Typography component='li'>
        Browser-Identifikation (enthält in der Regel die Browserversion, sowie das Betriebssystem)
      </Typography>

      <Typography component='li'>Innerhalb der App eingegebene Suchen nach Adressen oder Vergünstigungen;</Typography>

      <Typography component='li'>Standort-Positionen, falls der Standort in den Apps freigegeben ist.</Typography>
    </Typography>
    <Typography component='p' margin={0}>
      Sonstige Daten werden bei Ihrer Nutzung nicht automatisch erhoben und nicht an unsere Server gesendet. Nach dem
      Grundsatz der Datenvermeidung und der Datensparsamkeit sowie dem Grundsatz der anonymen und pseudonymen Nutzung
      wird nur das Minimum an Nutzungsdaten erhoben, soweit dies für den technischen Betrieb der Apps sowie die
      Ermittlung der aufgerufenen Inhalte erforderlich ist. Die erhobenen Informationen können weder direkt noch mit
      Hilfe von Zusatzwissen auf eine bestimmte Person zurückgeführt werden. Die einzelnen Nutzerinnen und Nutzer können
      somit nicht identifiziert werden. Wir erstellen keine Nutzungsprofile.
    </Typography>
    <Typography component='p' margin={0}>
      &nbsp;
    </Typography>
    <Typography component='p' marginTop={1}>
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
    <br />
    <Typography component='p' marginTop={1}>
      Tür an Tür – Digitalfabrik gGmbH,
      <Typography component='span'>
        <br />
        Wertachstr. 29,
      </Typography>
      <Typography component='span'>
        <br />
        86153 Augsburg
      </Typography>
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      Gegebenenfalls werden Ihre Daten an die zuständigen Aufsichts- und Rechnungsprüfungsbehörden zur Wahrnehmung der
      jeweiligen Kontrollrechte übermittelt.
    </Typography>
    <Typography component='p' marginTop={1}>
      Zur Abwehr von Gefahren für die Sicherheit in der Informationstechnik können bei elektronischer Übermittlung Daten
      an das Landesamt für Sicherheit in der Informationstechnik weitergeleitet werden und dort auf Grundlage der Art.
      12 ff. des Bayerischen E-Government-Gesetzes verarbeitet werden. Ihre Daten werden an die&nbsp;Stadt Nürnberg, Amt
      für Existenzsicherung und soziale Integration, Dietzstraße 4, 90443 Nürnberg weitergegeben, um den NürnbergPass
      sachgemäß auszustellen.
    </Typography>
    <Typography component='p' margin={0}>
      Eine Übermittlung der Daten in andere Drittländer&nbsp;erfolgt nicht. Der Serverstandort ist Deutschland.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Zustimmung (Einwilligung) zur Erhebung, Nutzung und Verarbeitung personenbezogener Daten
      </Typography>
      <Typography variant='body2bold' component='span'>
        <br />
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Außerhalb gesetzlicher Verpflichtungen dürfen personenbezogene Daten nur mit (und im Rahmen) Ihrer Zustimmung
      erhoben, genutzt oder verarbeitet werden.
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
      gelöscht. Aus der Nicht-Einwilligung oder einem Widerruf darf Ihnen kein Nachteil entstehen. Ein Widerruf kann nur
      mit Wirkung für die Zukunft erklärt werden.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Einwilligung durch Minderjährige
      </Typography>
      <br />
      Jugendliche können laut Art. 8 Abs. 1 DSGVO erst ab 16 Jahren wirksam in die Verarbeitung ihrer personenbezogenen
      Daten durch Dienstanbieter der Informationsgesellschaft einwilligen. Bei Minderjährigen unter 16 Jahren müssen die
      Erziehungsberechtigten einwilligen.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Dauer der Speicherung der personenbezogenen Daten
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Ihre Daten werden nur so lange gespeichert, wie dies unter Beachtung gesetzlicher Aufbewahrungsfristen zur
      Aufgabenerfüllung erforderlich ist. Die Speicherdauer kann bis zu 10 Jahre dauern.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Ihre Rechte
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Soweit wir von Ihnen personenbezogene Daten verarbeiten, stehen Ihnen als Betroffener nachfolgende Rechte zu:
    </Typography>
    <Typography component='ul'>
      <Typography component='li'>
        Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO).
      </Typography>

      <Typography component='li'>
        Sollten unrichtige personenbezogene Daten verarbeitet werden, steht Ihnen ein Recht auf Berichtigung zu (Art. 16
        DSGVO).
      </Typography>

      <Typography component='li'>
        Liegen die gesetzlichen Voraussetzungen vor, so können Sie die Löschung oder Einschränkung der Verarbeitung
        verlangen (Art. 17 und 18 DSGVO).
      </Typography>

      <Typography component='li'>
        Wenn Sie in die Verarbeitung eingewilligt haben oder ein Vertrag zur Datenverarbeitung besteht und die
        Datenverarbeitung mithilfe automatisierter Verfahren durchgeführt wird, steht Ihnen gegebenenfalls ein Recht auf
        Datenübertragbarkeit zu (Art. 20 DSGVO).
      </Typography>

      <Typography component='li'>
        Falls Sie in die Verarbeitung eingewilligt haben und die Verarbeitung auf dieser Einwilligung beruht, können Sie
        die Einwilligung jederzeit für die Zukunft widerrufen. Die Rechtmäßigkeit der aufgrund der Einwilligung bis zum
        Widerruf erfolgten Datenverarbeitung wird durch diesen nicht berührt.
      </Typography>

      <Typography component='li'>
        Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die
        Verarbeitung Ihrer Daten Widerspruch einzulegen, wenn die Verarbeitung ausschließlich auf Grundlage des Art. 6
        Abs. 1 UAbs. 1 Buchst. e oder f DSGVO erfolgt (Art. 21 Abs. 1 Satz 1 DSGVO).
      </Typography>
    </Typography>
    <br />
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
      <Typography component='span'>
        <br />
        Adresse: Wagmüllerstraße 18, 80538 München
      </Typography>
      <Typography component='span'>
        <br />
        Telefon: (089) 2126-72-0
      </Typography>
      <Typography component='span'>
        <br />
        Telefax: (089) 2126-72-50
      </Typography>
      <Typography component='span'>
        <br />
        Internet: www.datenschutz-bayern.de
      </Typography>
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Datensicherheit
      </Typography>
      <Typography component='span'>
        <br />
        Wir verwenden technische
      </Typography>
      und organisatorische Maßnahmen, um Ihre Daten vor dem Zugriff Unberechtigter und vor Manipulation, Übermittlung,
      Verlust oder Zerstörung zu schützen. Unsere Sicherheitsverfahren überprüfen wir regelmäßig und passen sie dem
      technologischen Fortschritt an.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Offenlegung und Weitergabe personenbezogener Daten
      </Typography>
      <Typography component='span'>
        <br />
        Alle personenbezogenen Daten werden ausschließlich mit Ihrer ausdrücklichen Zustimmung weitergegeben und werden
        für keine anderen Zwecke als die in unserer Datenschutzerklärung genannten, verwendet.
      </Typography>
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Datenerhebung, Datennutzung und Verarbeitung
      </Typography>
      <Typography variant='body2bold' component='span'>
        <br />
        Elektronische Datenerhebung innerhalb des Webangebotes
      </Typography>
      <Typography variant='body2bold' component='span'>
        <br />
      </Typography>
      Wenn Sie innerhalb unserer Online-Dienste aufgefordert werden personenbezogene Daten einzugeben, erfolgt deren
      Transport über das Internet unter Verwendung von SSL-Verschlüsselung, um Ihre Daten vor einer Kenntnisnahme durch
      Unbefugte zu schützen.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Elektronische Post (E-Mail)
      </Typography>
      <Typography component='span'>
        <br />
        Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail)
        Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist
      </Typography>
      nicht möglich. Wenn Sie uns E-Mails senden, wird Ihre E-Mail-Adresse nur für die Korrespondenz mit Ihnen
      verwendet. Informationen, die Sie unverschlüsselt per E-Mail an uns senden können, möglicherweise auf dem
      Übertragungsweg von Dritten gelesen werden.
    </Typography>
  </div>
)
