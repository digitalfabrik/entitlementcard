import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class VerificationPage extends StatefulWidget {
  const VerificationPage({
    Key key,
  }) : super(key: key);

  @override
  State<VerificationPage> createState() => _VerificationViewState();
}

class _VerificationViewState extends State<VerificationPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: Icon(
              Icons.arrow_back_ios,
              color: Theme.of(context).textTheme.bodyText1.color,
            ),
            onPressed: () => Navigator.of(context).pop(),
          ),
          title: Text("Karte verifizieren"),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: <Widget>[
              Card(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0)),
                  margin: EdgeInsets.all(8.0),
                  elevation: 5.0,
                  child: Padding(
                    padding: EdgeInsets.all(8.0),
                    child: RichText(text: _buildInfoText()),
                  )),
              Center(
                child: RaisedButton(
                    padding: EdgeInsets.symmetric(vertical: 12, horizontal: 24),
                    onPressed: () => print("Pressed!"),
                    color: Theme.of(context).primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(32.0),
                    ),
                    child: Text(
                      "Code einscannen",
                      style: Theme.of(context)
                          .textTheme
                          .headline6
                          .merge(TextStyle(color: Colors.white, fontSize: 20)),
                    )),
              )
            ],
          ),
        ));
  }

  TextSpan _buildInfoText() {
    return TextSpan(style: DefaultTextStyle.of(context).style, children: [
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
                text: "\"Ausweisen\"-Seite ",
                style: TextStyle(fontStyle: FontStyle.italic)),
            TextSpan(text: "ihres Gegenübers angezeigt wird.\n"),
            TextSpan(
                text: "Daraufhin wird durch eine Server-Anfrage geprüft, "
                    "ob die gescannte Ehrenamtskarte gültig ist.\n"),
            TextSpan(text: "Sie benötigen eine Internetverbindung."),
          ]),
    ]);
  }
}
