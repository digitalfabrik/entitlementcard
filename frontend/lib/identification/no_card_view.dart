import 'package:flutter/material.dart';

class NoCardView extends StatelessWidget {
  final VoidCallback startVerification;
  final VoidCallback startActivateQrCode;

  const NoCardView({Key key, this.startVerification, this.startActivateQrCode})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(30.0),
            child: Icon(Icons.contact_support_outlined,
                size: 100, color: Theme.of(context).accentColor),
          ),
          SizedBox(height: 60),
          ConstrainedBox(
              constraints: BoxConstraints(maxWidth: 300),
              child: Column(children: [
                Text("Sie sind ehrenamtlich engagiert …",
                    style: Theme.of(context).textTheme.headline6,
                    textAlign: TextAlign.center),
                SizedBox(height: 24),
                Text(
                    "… und haben bereits einen Aktivierungscode"
                    " für die digitale Ehrenamtskarte?",
                    textAlign: TextAlign.center),
                TextButton(
                  onPressed: startActivateQrCode,
                  child: Text("Jetzt Aktivierungscode einscannen"),
                )
              ])),
          Divider(height: 80),
          ConstrainedBox(
              constraints: BoxConstraints(maxWidth: 300),
              child: Column(children: [
                Text(
                  "Sie arbeiten bei einer Akzeptanzstelle …",
                  style: Theme.of(context).textTheme.headline6,
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 24),
                Text(
                    "… und möchten eine Ihnen gezeigte digitale Ehrenamtskarte"
                    " auf Echtheit prüfen?",
                    textAlign: TextAlign.center),
                TextButton(
                  onPressed: startVerification,
                  child: Text("Jetzt Ehrenamtskarte validieren"),
                )
              ]))
        ],
      ),
    );
  }
}
