import 'package:flutter/material.dart';

class VerificationInfoText extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return RichText(
        text: TextSpan(style: DefaultTextStyle.of(context).style, children: [
      TextSpan(
          text: "So prüfen Sie die Echtheit einer Ehrenamtskarte:\n\n",
          style: DefaultTextStyle.of(context)
              .style
              .apply(fontSizeFactor: 1.8, fontWeightDelta: 2)),
      TextSpan(
          style: DefaultTextStyle.of(context)
              .style
              .copyWith(height: 1.2)
              .apply(fontSizeFactor: 1.4),
          children: [
            TextSpan(text: "Scannen Sie den QR Code, der auf der "),
            TextSpan(
                text: "„Ausweisen“-Seite ",
                style: TextStyle(fontStyle: FontStyle.italic)),
            TextSpan(text: "Ihres Gegenübers angezeigt wird.\n"),
            TextSpan(
                text: "Daraufhin wird durch eine Server-Anfrage geprüft, "
                    "ob die gescannte Ehrenamtskarte gültig ist.\n"),
            TextSpan(text: "Sie benötigen eine Internetverbindung."),
          ]),
    ]));
  }
}
