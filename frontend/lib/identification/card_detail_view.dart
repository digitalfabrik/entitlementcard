import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_svg/svg.dart';
import 'package:intl/intl.dart';

import 'card_details.dart';
import 'id_card.dart';
import 'verification_qr_code_view.dart';

class CardDetailView extends StatelessWidget {
  final CardDetails cardDetails;
  final VoidCallback onOpenQrScanner;

  CardDetailView({Key key, this.cardDetails, this.onOpenQrScanner})
      : super(key: key);

  get _formattedExpirationDate => cardDetails.expirationDate != null
      ? DateFormat('dd.MM.yyyy').format(cardDetails.expirationDate)
      : "unbegrenzt";

  @override
  Widget build(BuildContext context) {
    var isLandscape =
        MediaQuery.of(context).orientation == Orientation.landscape;

    return Flex(
      direction: isLandscape ? Axis.horizontal : Axis.vertical,
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      mainAxisSize: MainAxisSize.min,
      children: [
        Column(
          crossAxisAlignment: isLandscape
              ? CrossAxisAlignment.start
              : CrossAxisAlignment.stretch,
          children: [
            IdCard(
              height: isLandscape ? 200 : null,
              child: SvgPicture.asset("assets/card.svg",
                  semanticsLabel: 'Ehrenamtskarte',
                  alignment: Alignment.center,
                  fit: BoxFit.contain),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 4),
              alignment: Alignment.centerRight,
              child: InkWell(
                  child: Text(
                    "Code neu einscannen",
                    style: TextStyle(color: Theme.of(context).accentColor),
                  ),
                  onTap: onOpenQrScanner),
            ),
          ],
        ),
        SizedBox(height: 15, width: 15),
        Flexible(
          fit: FlexFit.loose,
          child: Padding(
              padding: EdgeInsets.all(4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    cardDetails.fullName ?? "",
                    style: Theme.of(context).textTheme.headline6,
                  ),
                  SizedBox(height: 5),
                  Text("Gültig bis: $_formattedExpirationDate"),
                  SizedBox(
                    height: 24,
                  ),
                  Center(
                      child: MaterialButton(
                    onPressed: () {
                      showDialog(
                          context: context,
                          builder: (_) => VerificationQrCodeView(
                                cardDetails: cardDetails,
                              ));
                    },
                    color: Colors.white,
                    textColor: Colors.black,
                    child: Icon(
                      Icons.qr_code,
                      size: 50,
                    ),
                    padding: EdgeInsets.all(16),
                    shape: CircleBorder(),
                  )),
                ],
              )),
        )
      ],
    );
  }
}
