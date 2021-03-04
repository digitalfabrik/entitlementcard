import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';

String copyright = '''
Die Inhalte dieser App, insbesondere alle Texte, Bilder, Grafiken, Logos, Ton-, Video- und Animationsdateien sowie auch ihre Arrangements, unterliegen dem Urheberrecht und anderen Gesetzen zum Schutze des geistigen Eigentums.

Untersagt sind insbesondere
• die Verwendung von Bildschirmkopien zu gewerblichen Zwecken und
• der Aufbau eigener aus der App zur Bayerischen Ehrenamtskarte abgeleiteter Datensammlungen.

Erlaubt ist
• die Anfertigung von Bildschirmkopien für den privaten und sonstigen eigenen Gebrauch.

Jede weitergehende Nutzung, auch das Herunterladen der Kartengrundlagen, bedarf einer gesonderten Genehmigung. Die Rechte an den Kartengrundlagen liegen beim Bayerischen Staatsministerium für Arbeit und Soziales, Familie und Integration.
''';

class Copyright extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
        child: Padding(padding: EdgeInsets.all(10), child: Text(copyright)));
  }
}
