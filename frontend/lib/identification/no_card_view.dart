import 'package:flutter/material.dart';

class NoCardView extends StatelessWidget {
  final VoidCallback startVerification;
  final VoidCallback startActivateQrCode;
  final VoidCallback startEakApplication;

  const NoCardView(
      {Key key,
      this.startVerification,
      this.startActivateQrCode,
      this.startEakApplication})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var isLandscape =
        MediaQuery.of(context).orientation == Orientation.landscape;

    Widget wrapIntrinsic(Widget widget) => isLandscape
        ? IntrinsicHeight(child: widget)
        : IntrinsicWidth(child: widget);

    return SingleChildScrollView(
        child: SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(30.0),
            child: Icon(Icons.contact_support_outlined,
                size: 100, color: Theme.of(context).accentColor),
          ),
          SizedBox(height: 30),
          wrapIntrinsic(
            Flex(
                direction: isLandscape ? Axis.horizontal : Axis.vertical,
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  ConstrainedBox(
                      constraints: BoxConstraints(maxWidth: 300),
                      child: Column(children: [
                        Text("Sie sind ehrenamtlich engagiert …",
                            style: Theme.of(context).textTheme.headline6,
                            textAlign: TextAlign.center),
                        SizedBox(height: 24, width: 24),
                        Text(
                            "… und haben bereits einen Aktivierungscode"
                            " für die digitale Ehrenamtskarte?",
                            textAlign: TextAlign.center),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: OutlinedButton(
                            onPressed: startActivateQrCode,
                            child: Text("Jetzt Aktivierungscode einscannen"),
                          ),
                        ),
                        SizedBox(height: 16),
                        Text("… haben aber noch keine"
                            " Bayerische Ehrenamtskarte?",
                            textAlign: TextAlign.center),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: OutlinedButton(
                            onPressed: startEakApplication,
                            child: Text("Jetzt Ehrenamtskarte beantragen"),
                          ),
                        )
                      ])),
                  isLandscape
                      ? VerticalDivider(width: 80)
                      : Divider(height: 80),
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
                            "… und möchten eine Ihnen gezeigte digitale"
                            " Ehrenamtskarte auf Echtheit prüfen?",
                            textAlign: TextAlign.center),
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: OutlinedButton(
                            onPressed: startVerification,
                            child: Text("Jetzt Ehrenamtskarte validieren"),
                          ),
                        )
                      ]))
                ]),
          ),
        ],
      ),
    ));
  }
}
