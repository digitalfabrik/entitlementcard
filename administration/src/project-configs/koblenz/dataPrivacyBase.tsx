import { Link, Typography } from '@mui/material'
import React, { ReactElement } from 'react'

export const dataPrivacyBaseHeadline =
  'Datenschutzerklärung für die Nutzung und Aktivierung des digitalen KoblenzPasses'

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
    <Typography variant='h6' component='h2'>
      Vorbemerkungen:
    </Typography>
    <Typography component='p' marginTop={1}>
      Diese Datenschutzerklärung bezieht sich auf die Verarbeitung personenbezogener Daten im Rahmen
      des digitalen KoblenzPasses einschließlich verbundener Dienste.
    </Typography>
    <Typography component='p' marginTop={1}>
      Der digitale KoblenzPass wird im Auftrag der Stadt Koblenz durch die Tür an Tür –
      Digitalfabrik gGmbH, Wertachstraße 29, 86153 Augsburg betrieben.
    </Typography>
    <Typography component='p' marginTop={1}>
      Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
      behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen
      Datenschutzvorschriften sowie dieser Datenschutzerklärung.
    </Typography>
    <Typography component='p' marginTop={1}>
      Der gesamte Programmcode des digitalen KoblenzPasses ist darüber hinaus quelloffen lizenziert
      unter der MIT-Lizenz und kann hier eingesehen werden:
      <Link
        href='https://github.com/digitalfabrik/entitlementcard'
        target='_blank'
        rel='noreferrer'
        sx={{ display: 'block' }}
      >
        https://github.com/digitalfabrik/entitlementcard
      </Link>
    </Typography>
    <Typography variant='h6' component='h2'>
      Kontaktdaten:
    </Typography>
    <Typography component='p' marginTop={1}>
      Für nähere Informationen zur Verarbeitung Ihrer personenbezogenen Daten können Sie uns unter
      den unten genannten Kontaktdaten erreichen.
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Name und Kontaktdaten des Verantwortlichen
      </Typography>
      <br />
      Stadt Koblenz
      <br />
      Sozialamt
      <br />
      Telefon: +49 (0)261 129 1000
      <br />
      E-Mail:
      <Link
        href='mailto:koblenzpass@stadt.koblenz.de'
        target='_blank'
        rel='noreferrer'
        sx={{ display: 'block' }}
      >
        koblenzpass@stadt.koblenz.de
      </Link>
    </Typography>
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Kontaktdaten der Datenschutzbeauftragten
      </Typography>
      <br />
      Informationssicherheits- und Datenschutz-Management der Stadtverwaltung Koblenz
      <br />
      Datenschutzbeauftragter: Oliver Philippsen
      <br />
      Informationssicherheitsbeauftragter: Dominik Weber
      <br />
      Willi-Hörter-Platz 1
      <br />
      56068 Koblenz
      <br />
      Telefon: +49 (0)261 129-1017
      <br />
      E-Mail:
      <Link
        href='mailto:security.management@stadt.koblenz.de'
        target='_blank'
        rel='noreferrer'
        sx={{ display: 'block' }}
      >
        security.management@stadt.koblenz.de
      </Link>
    </Typography>

    <Typography component='p' marginTop={1}>
      Allgemeines zum Thema Datenschutz finden Sie auf der Website des Landesbeauftragten für den
      Datenschutz und die Informationsfreiheit Rheinland-Pfalz
      <Link
        href='https://www.datenschutz.rlp.de'
        target='_blank'
        rel='noreferrer'
        sx={{ display: 'block' }}
      >
        (https://www.datenschutz.rlp.de)
      </Link>
    </Typography>

    <Typography variant='h6' component='h2'>
      Zwecke und Rechtsgrundlagen für die Verarbeitung personenbezogener Daten
    </Typography>
    <Typography component='p' marginTop={1}>
      Zweck der Verarbeitung ist die Bereitstellung und spätere Nutzung eines beantragten digitalen
      KoblenzPasses.
    </Typography>
    <Typography component='p' marginTop={1}>
      Die Datenverarbeitungen im Zusammenhang mit der Bereitstellung und Nutzung des digitalen
      KoblenzPass sind Verarbeitungen personenbezogener Daten gemäß Art. 4 der
      Datenschutz-Grundverordnung (DSGVO). Diese erfolgt aufgrund ausdrücklicher Einwilligung,
      mithin des/der Personensorgeberechtigten (Art. 6 Abs. 1 lit. a DSGVO). Um dies zu
      gewährleisten, müssen Sie beim Abrufen des digitalen KoblenzPasses explizit der Verarbeitung
      Ihrer Daten zustimmen. Dies erfolgt ausschließlich, um Sie als berechtigten
      KoblenzPass-Inhaber bzw. -Inhaberin zu identifizieren. Die Daten werden nicht gespeichert.
    </Typography>
    <Typography component='p' marginTop={1}>
      Rechtsgrundlage für die vorübergehende Speicherung und Verarbeitung von Daten hinsichtlich der
      Bereitstellung der Website „KoblenzPass-Portal“ und Erstellung von notwendigen Logfiles ist
      Art. 6 Abs. 1 lit. e DSGVO.
    </Typography>
    <Typography component='p' marginTop={1}>
      <br />
      <Typography variant='body2bold' component='span'>
        Automatische Speicherung von Daten:
      </Typography>
      <br />
      Bei jedem Zugriff auf das webbasierte KoblenzPass-Portal zum Abruf und zur Verlängerung eines
      KoblenzPasses werden folgende Nutzungsdaten erhoben:
    </Typography>
    <Typography component='ul'>
      <Typography component='li'>Datum und Uhrzeit des Abrufs</Typography>

      <Typography component='li'>
        Name des aufgerufenen Internetdienstes, der aufgerufenen Ressource und der verwendeten
        Aktion
      </Typography>

      <Typography component='li'>vollständige IP-Adresse des anfordernden Rechners</Typography>

      <Typography component='li'>Abfrage, die der Client gestellt hat</Typography>

      <Typography component='li'>übertragene Datenmenge</Typography>

      <Typography component='li'>Meldung, ob der Abruf erfolgreich war</Typography>

      <Typography component='li'>
        Browser-Identifikation (enthält in der Regel die Browserversion, sowie das Betriebssystem)
      </Typography>

      <Typography component='li'>
        Innerhalb der App eingegebene Suchen nach Adressen oder Vergünstigungen;
      </Typography>

      <Typography component='li'>
        Standort-Positionen, falls der Standort in den Apps freigegeben ist.
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Die in den Formularfelder eingegebenen Daten werden ebenfalls an den Server gesendet und dort
      transient verarbeitet. Eine Speicherung der Daten erfolgt nicht.
    </Typography>
    <Typography component='p' marginBottom={0}>
      Sonstige Daten werden bei Ihrer Nutzung nicht automatisch erhoben und nicht an unsere Server
      gesendet. Nach dem Grundsatz der Datenvermeidung und der Datensparsamkeit sowie dem Grundsatz
      der anonymen und pseudonymen Nutzung wird nur das Minimum an Nutzungsdaten erhoben, soweit
      dies für den technischen Betrieb und die Sicherheit der Apps sowie die Ermittlung der
      aufgerufenen Inhalte erforderlich ist. Die erhobenen Informationen können weder direkt noch
      mit Hilfe von Zusatzwissen auf eine bestimmte Person zurückgeführt werden. Die einzelnen
      Nutzerinnen und Nutzer können somit nicht identifiziert werden. Wir erstellen keine
      Nutzungsprofile.
    </Typography>
    <Typography component='p' marginTop={0} marginBottom={0}>
      &nbsp;
    </Typography>
    <Typography component='p' marginTop={0}>
      Zur Gewährleistung des technischen Betriebs wird die IP-Adresse für 14 Tage in den
      Serverprotokollen gespeichert und danach gelöscht.
    </Typography>
    <Typography component='p' marginTop={1}>
      <br />
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
      Alle uns bekannt gewordenen personenbezogenen Daten von betroffenen Personen dürfen wir nur
      dann an andere Personen oder Stellen weitergeben oder für andere Zwecke verwenden, wenn diese
      dem zugestimmt haben oder die Weitergabe gesetzlich zugelassen ist.
    </Typography>
    <Typography component='p' marginTop={1}>
      <br />
      <Typography variant='body2bold' component='span'>
        Einwilligung durch Minderjährige
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Personenbezogene Daten von Minderjährigen unter 16 Jahren werden nicht bewusst erhoben und
      verarbeitet. Gemäß Art. 8 DSGVO dürfen Jugendliche ab 16 Jahre ihr Einverständnis zur
      Datenverarbeitung selbst erteilen. Für Kinder und Jugendliche unter 16 Jahren bedarf es der
      Einverständniserklärung der Personensorgeberechtigten.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Dauer der Speicherung der personenbezogenen Daten
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Ihre Daten werden, vorbehaltlich eines Widerrufs, nur so lange gespeichert, wie dies unter
      Beachtung gesetzlicher Aufbewahrungsfristen zur Aufgabenerfüllung erforderlich ist.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Widerrufsrecht bei Einwilligung:
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Die Einwilligung kann jederzeit für die Zukunft widerrufen werden. Die Rechtmäßigkeit der
      aufgrund der Einwilligung bis zum Widerruf erfolgten Datenverarbeitung wird durch diesen nicht
      berührt.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Ihre Rechte
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Soweit wir von Ihnen personenbezogene Daten verarbeiten, stehen Ihnen als Betroffener
      nachfolgende Rechte zu:
    </Typography>
    <Typography component='ul'>
      <Typography component='li'>
        Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten (Art. 15
        DSGVO).
      </Typography>

      <Typography component='li'>
        Sollten unrichtige personenbezogene Daten verarbeitet werden, steht Ihnen ein Recht auf
        Berichtigung zu (Art. 16 DSGVO).
      </Typography>

      <Typography component='li'>
        Liegen die gesetzlichen Voraussetzungen vor, so können Sie die Löschung oder Einschränkung
        der Verarbeitung verlangen (Art. 17 und 18 DSGVO).
      </Typography>

      <Typography component='li'>
        Wenn Sie in die Verarbeitung eingewilligt haben oder ein Vertrag zur Datenverarbeitung
        besteht und die Datenverarbeitung mithilfe automatisierter Verfahren durchgeführt wird,
        steht Ihnen gegebenenfalls ein Recht auf Datenübertragbarkeit zu (Art. 20 DSGVO).
      </Typography>

      <Typography component='li'>
        Falls Sie in die Verarbeitung eingewilligt haben und die Verarbeitung auf dieser
        Einwilligung beruht, können Sie die Einwilligung jederzeit für die Zukunft widerrufen. Die
        Rechtmäßigkeit der aufgrund der Einwilligung bis zum Widerruf erfolgten Datenverarbeitung
        wird durch diesen nicht berührt.
      </Typography>

      <Typography component='li'>
        Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit
        gegen die Verarbeitung Ihrer Daten Widerspruch einzulegen, wenn die Verarbeitung
        ausschließlich auf Grundlage des Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt (Art. 21 Abs. 1
        Satz 1 DSGVO).
      </Typography>
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Beschwerderecht bei der Aufsichtsbehörde
      </Typography>
    </Typography>
    <Typography component='p' marginTop={1}>
      Weiterhin besteht ein Beschwerderecht beim Landesbeauftragten für den Datenschutz und die
      Informationsfreiheit Rheinland-Pfalz. Diesen können Sie unter folgenden Kontaktdaten
      erreichen:
    </Typography>
    <Typography component='p' marginTop={1}>
      Postanschrift: Postfach 30 40 55020 Mainz
      <br />
      Adresse: Hinter Bleiche 34, 55116 Mainz
      <br />
      Telefon: +49 (0) 6131 8920-0
      <br />
      Telefax: +49 (0) 6131 8920-299
      <br />
      E-Mail: poststelle@datenschutz.rlp.de
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Datensicherheit
      </Typography>
      <br />
      Wir verwenden technische und organisatorische Maßnahmen, um Ihre Daten vor dem Zugriff
      Unberechtigter und vor Manipulation, Übermittlung, Verlust oder Zerstörung zu schützen. Unsere
      Sicherheitsverfahren überprüfen wir regelmäßig und passen sie dem technologischen Fortschritt
      an.
    </Typography>
    <br />
    <Typography component='p' marginTop={1}>
      <Typography variant='body2bold' component='span'>
        Elektronische Post (E-Mail)
      </Typography>
      <br />
      Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per
      E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff
      durch Dritte ist nicht möglich. Wenn Sie uns E-Mails senden, wird Ihre E-Mail-Adresse nur für
      die Korrespondenz mit Ihnen verwendet. Informationen, die Sie unverschlüsselt per E-Mail an
      uns senden können, möglicherweise auf dem Übertragungsweg von Dritten gelesen werden.
    </Typography>
    <br />
  </div>
)
