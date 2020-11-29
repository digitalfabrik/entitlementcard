import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class DetailView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final double sectionSpacing = 16.0;
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: new Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
              padding: EdgeInsets.only(bottom: 5),
              child: Text(
                "Akzeptanzstelle XY",
                style: Theme.of(context).textTheme.headline6,
              )),
          Text(
            "vergünstigter Eintritt € 5,50 vergünstigter Eintritt € 5,50 vergünstigter Eintritt € 5,50",
          ),
          SizedBox(height: sectionSpacing),
          Table(columnWidths: {
            0: FlexColumnWidth(1),
            1: FlexColumnWidth(4),
          }, children: [
            TableRow(children: [
              Text("Adr", style: Theme.of(context).textTheme.bodyText1),
              Text('SENDLINGER-TOR-PLATZ 11 \n80336 MÜNCHEN')
            ]),
            TableRow(children: [
              Text("Tel", style: Theme.of(context).textTheme.bodyText1),
              Text('089554636')
            ]),
            TableRow(children: [
              Text("E-Mail", style: Theme.of(context).textTheme.bodyText1),
              Text('sendlingertor@pressmar-kinos.de')
            ]),
            TableRow(children: [
              Text("Website", style: Theme.of(context).textTheme.bodyText1),
              Text('pressmar-kinos.de')
            ]),
          ]),
          SizedBox(height: sectionSpacing),
          Text("Kontakt", style: Theme.of(context).textTheme.bodyText1),
          Text("Hier sind die Kontaktdaten der Kontakperson")
        ],
      ),
    );
  }
}
