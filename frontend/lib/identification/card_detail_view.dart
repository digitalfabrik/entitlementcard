import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

import '../graphql/graphql_api.dart';
import 'card/eak_card.dart';
import 'card/id_card.dart';
import 'card_details.dart';
import 'verification_qr_code_view.dart';

class CardDetailView extends StatelessWidget {
  final CardDetails cardDetails;
  final VoidCallback openQrScanner;
  final VoidCallback startVerification;

  CardDetailView(
      {Key key, this.cardDetails, this.openQrScanner, this.startVerification})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final getRegions = GetRegionsQuery();
    return Query(
        options: QueryOptions(
            document: getRegions.document,
            variables: getRegions.getVariablesMap()),
        builder: (result, {fetchMore, refetch}) {
          var isLandscape =
              MediaQuery.of(context).orientation == Orientation.landscape;
          var region = result.hasException || result.isLoading
              ? null
              : getRegions.parse(result.data).regions.firstWhere(
                  (element) => element.id == cardDetails.regionId,
                  orElse: () => null);
          return Flex(
            direction: isLandscape ? Axis.horizontal : Axis.vertical,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            mainAxisSize: MainAxisSize.min,
            children: [
              Column(
                crossAxisAlignment: isLandscape
                    ? CrossAxisAlignment.start
                    : CrossAxisAlignment.stretch,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: IdCard(
                        height: isLandscape ? 200 : null,
                        child:
                            EakCard(cardDetails: cardDetails, region: region)),
                  ),
                ],
              ),
              SizedBox(height: 15, width: 15),
              Flexible(
                child: Padding(
                    padding: EdgeInsets.all(4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Padding(
                            padding: EdgeInsets.symmetric(
                                vertical: 5, horizontal: 30),
                            child: Text(
                              "Mit diesem QR-Code können Sie sich"
                              " bei Akzeptanzstellen ausweisen:",
                              textAlign: TextAlign.center,
                            )),
                        VerificationQrCodeView(
                          cardDetails: cardDetails,
                        ),
                        Container(
                          padding: EdgeInsets.all(4),
                          alignment: Alignment.center,
                          child: TextButton(
                              child: Text(
                                "Weitere Aktionen",
                                style: TextStyle(
                                    color: Theme.of(context).accentColor),
                              ),
                              onPressed: () => _onMoreActionsPressed(context)),
                        ),
                      ],
                    )),
              )
            ],
          );
        });
  }

  void _onMoreActionsPressed(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return SimpleDialog(
          contentPadding: EdgeInsets.only(top: 8),
          title: Text("Weitere Aktionen"),
          children: [
            ListTile(
              title: Text("Anderen Aktivierungscode einscannen"),
              subtitle:
                  Text("Dadurch wird die bestehende Karte vom Gerät gelöscht."),
              leading: Icon(Icons.qr_code_scanner, size: 36),
              onTap: () {
                Navigator.pop(context);
                openQrScanner();
              },
            ),
            ListTile(
                title: Text("Eine digitale Ehrenamtskarte prüfen"),
                subtitle:
                    Text("Verfizieren Sie die Echtheit einer Ehrenamtskarte."),
                leading: Icon(Icons.check_circle_outline, size: 36),
                onTap: () {
                  Navigator.pop(context);
                  startVerification();
                }),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(mainAxisAlignment: MainAxisAlignment.end, children: [
                TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text("Abbrechen"))
              ]),
            )
          ],
        );
      },
    );
  }
}
