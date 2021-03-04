import 'package:ehrenamtskarte/about/content_tile.dart';
import 'package:flutter/material.dart';
import 'package:package_info/package_info.dart';

String copyright = '''
Die Inhalte dieser App, insbesondere alle Texte, Bilder, Grafiken, Logos, Ton-, Video- und Animationsdateien sowie auch ihre Arrangements, unterliegen dem Urheberrecht und anderen Gesetzen zum Schutze des geistigen Eigentums.

Untersagt sind insbesondere
• die Verwendung von Bildschirmkopien zu gewerblichen Zwecken und
• der Aufbau eigener aus der App zur Bayerischen Ehrenamtskarte abgeleiteter Datensammlungen.

Erlaubt ist
• die Anfertigung von Bildschirmkopien für den privaten und sonstigen eigenen Gebrauch.

Jede weitergehende Nutzung, auch das Herunterladen der Kartengrundlagen, bedarf einer gesonderten Genehmigung. Die Rechte an den Kartengrundlagen liegen beim Bayerischen Staatsministerium für Arbeit und Soziales, Familie und Integration.
''';

String dataPrivacy = '''
Die in der App genutzten Dienste zur Darstellung der Karten, Vergünstigungen und zur Suche nach Adressen und Vergünstigungen werden von IT.NRW betrieben bzw. bereitgestellt. Innerhalb der App eingegebene Suchen nach Adressen oder Vergünstigungen sowie Standort-Positionen werden unverschlüsselt an IT.NRW übertragen, vertraulich behandelt und nicht dauerhaft gespeichert oder an Dritte weitergegeben. Die Preisgabe dieser Daten seitens des Anwenders erfolgt auf freiwilliger Basis.
Weitere Dienste und Funktionen werden von Ihrem mobilen Betriebssystem verwendet. Die Nutzung und Weitergabe in diesem Zusammenhang verwendeter Daten obliegt dem Anwender oder Betriebssystem.
Allgemeines zum Thema Datenschutz finden Sie auf der Website des Bayerischen Landesbeauftragten für den Datenschutz (vgl. https://www.datenschutz-bayern.de). 
''';

String disclaimer = '''
Verantwortlich im Sinne § 7 TMG:

Christian K. J. Diener
Leiter Referat Öffentlichkeitsarbeit
Telefon: 089 1261-1640
Telefax: 089 1261-181640
E-Mail: Oeffentlichkeitsarbeit@stmas.bayern.de
Haftung im Sinne §§ 7 - 10 TMG
Das Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration stellt sein App-Angebot unter folgenden Nutzungsbedingungen zur Verfügung:

• "Die App zur Bayerischen Ehrenamtskarte" ist nach § 7 Abs. 1 TMG für die eigenen Inhalte, die es zur Nutzung bereithält, nach den allgemeinen Vorschriften verantwortlich. Die Haftung für Schäden materieller oder ideeller Art, die durch die Nutzung der Inhalte verursacht wurden, ist ausgeschlossen, sofern nicht Vorsatz oder grobe Fahrlässigkeit vorliegt.
Bei der Zusammenstellung und Abgabe der Informationen von Vergünstigungen wird alle Sorgfalt walten gelassen. Eine Gewähr für die inhaltliche Vollständigkeit und Richtigkeit der Daten kann dennoch nicht übernommen werden. Insbesondere wird jede Haftung für solche Schäden ausgeschlossen, die bei Anwendern direkt oder indirekt daraus entstehen, dass die Daten genutzt werden.
• Soweit ein Text von dritter Seite erstellt ist, wird die jeweilige Verfasserin oder der jeweilige Verfasser oder die verantwortliche Einrichtung namentlich benannt. In diesen Fällen ist die Verfasserin oder der Verfasser bzw. die genannte Einrichtung des jeweiligen Dokuments für den Inhalt verantwortlich.
• "Die App zur Bayerischen Ehrenamtskarte" bewertet den Inhalt der verzeichneten Web-Sites zum Zeitpunkt ihrer Aufnahme in das Verzeichnis sorgfältig, und es werden nur solche Verweise aufgenommen, deren Inhalt nach Prüfung zum Zeitpunkt der Aufnahme nicht gegen geltendes Recht verstößt.
• "Die App zur Bayerischen Ehrenamtskarte" macht sich den Inhalt der zugänglich gemachten fremden Websites jedoch ausdrücklich nicht zu Eigen. Die Inhalte der Sites, auf die verwiesen wird, können sich ständig ändern - das macht gerade das Wesen eines WWW-Angebots aus. Aus diesem Grund übernimmt "Die App zur Bayerischen Ehrenamtskarte" trotz Prüfung keine Gewähr für die Korrektheit, Vollständigkeit und Verfügbarkeit der jeweiligen fremden Website.
• "Die App zur Bayerischen Ehrenamtskarte" hat keinen Einfluss auf die aktuelle und zukünftige Gestaltung und Inhalte der Seiten.
• "Die App zur Bayerischen Ehrenamtskarte" übernimmt keine Haftung für Schäden, die aus der Benutzung der Links entstehen könnten.
''';

String publisher = '''
Bayerisches Staatsministerium für Arbeit und Soziales, Familie und Integration
Winzererstraße 9
80797 München

Telefon: 089 1261-01
Telefax: 089 1261-1122
E-Mail: Poststelle@stmas.bayern.de

USt-Identifikations-Nr. gemäß § 27 a Umsatzsteuergesetz: DE - 811335517Verantwortlich für den Inhalt

Christian K. J. Diener
Leiter Referat Öffentlichkeitsarbeit
Telefon: 089 1261-1640
Telefax: 089 1261-181640
E-Mail: Oeffentlichkeitsarbeit@stmas.bayern.de

E-Mail zur Ehrenamtskarte: Ehrenamtskarte@stmas.bayern.de

Technische Umsetzung/Programmierungen:
Tür an Tür - Digitalfabrik gemeinnützige GmbH
https://tuerantuer.de/digitalfabrik/
''';

String publisherAdress = '''
Bayerisches Staatsministerium\nfür Familie, Arbeit und Soziales\nWinzererstraße 7\n80797 München
''';


class AboutPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: FutureBuilder<PackageInfo>(
            future: PackageInfo.fromPlatform(),
            builder: (context, snapshot) {
              List<Widget> children;
              if (snapshot.hasData) {
                children = [
                  Center(
                      child: Padding(
                          padding: EdgeInsets.all(10),
                          child: ClipRRect(
                              borderRadius: BorderRadius.circular(20.0),
                              child: Image(
                                image: AssetImage("assets/icon/icon.png"),
                                height: 100.0,
                                width: 100.0,
                                fit: BoxFit.cover,
                              )))),
                  Center(
                      child: Text(snapshot.data.appName,
                          style: Theme.of(context).textTheme.headline5)),
                  Center(
                      child: Text(snapshot.data.version,
                          style: Theme.of(context).textTheme.bodyText2)),
                  const Divider(
                    height: 20,
                    thickness: 1,
                  ),
                  InkWell(
                    child: Column(
                      children: [
                        Center(
                            child: Text("Herausgeber",
                                style: Theme.of(context).textTheme.subtitle2)),
                        Padding(
                            padding: EdgeInsets.all(10),
                            child: Text(
                                publisherAdress,
                                style: Theme.of(context).textTheme.bodyText1)),
                      ],
                    ),
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ContentPage(
                                title: "Herausgeber", content: publisher),
                          ));
                    },
                  ),
                  const Divider(
                    height: 20,
                    thickness: 1,
                  ),
                  ContentTile(
                      icon: Icons.copyright,
                      title: "Urheberrecht",
                      content: copyright),
                  ContentTile(
                      icon: Icons.privacy_tip_outlined,
                      title: "Datenschutzerklärung",
                      content: dataPrivacy),
                  ContentTile(
                      icon: Icons.info_outline,
                      title: "Haftung, Haftungsausschluss und Disclaimer",
                      content: disclaimer),
                  ListTile(
                      leading: Icon(Icons.copyright),
                      title: Text("Lizenzen"),
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => LicensePage(),
                            ));
                      })
                ];
              } else {
                children = [];
              }
              return ListView(children: children);
            }));
  }
}
