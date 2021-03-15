import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';

import 'card_details.dart';

class CardLogo extends StatelessWidget {
  final String title;
  final Image logo;
  final double scaleFactor;

  const CardLogo({Key key, this.title, this.logo, this.scaleFactor})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(4.0 * scaleFactor),
      child: Column(children: [
        Flexible(
            child: Padding(
          padding: EdgeInsets.all(2 * scaleFactor),
          child: logo != null ? logo : Container(),
        )),
        Text(title,
            maxLines: 1,
            style:
                TextStyle(fontSize: 8 * scaleFactor, color: bavariaFontColor))
      ]),
    );
  }
}

final blueCardColor = Color(0xffcfeaff);
final goldenCardColor = Color(0xffcab374);
final bavariaFontColor = Color(0xff008dc9);
final textColor = Color(0xff172c82);

class CardSvg extends StatelessWidget {
  final CardDetails cardDetails;
  final GetRegions$Query$Region region;

  const CardSvg({Key key, this.cardDetails,  this.region})
      : super(key: key);

  get _formattedExpirationDate => cardDetails.expirationDate != null
      ? DateFormat('dd.MM.yyyy').format(cardDetails.expirationDate)
      : "unbegrenzt";

  @override
  Widget build(BuildContext context) {
    var cardColor =
        cardDetails.cardType == CardType.gold ? goldenCardColor : blueCardColor;
    return LayoutBuilder(builder: (context, constraints) {
      var scaleFactor = constraints.maxWidth / 300;
      return Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              color: Color(0xf5f5f5ff),
              child: AspectRatio(
                  aspectRatio: 6 / 1,
                  child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        CardLogo(
                            title: region != null
                                ? "${region.prefix} ${region.name}" : "",
                            scaleFactor: scaleFactor),
                        CardLogo(
                          title: "Freistaat Bayern",
                          scaleFactor: scaleFactor,
                          logo: Image(
                              image: AssetImage("assets/wappen-bavaria.png"),
                              fit: BoxFit.contain),
                        )
                      ])),
            ),
            // Body
            Flexible(
              child: Container(
                decoration: BoxDecoration(
                    gradient: RadialGradient(
                        colors: [cardColor.withAlpha(100), cardColor],
                        radius: 1)),
                child: Column(children: [
                  Padding(
                    padding: EdgeInsets.all(8 * scaleFactor),
                    child: AspectRatio(
                        aspectRatio: 6 / 1.2,
                        child: SvgPicture.asset("assets/eak-lettering.svg",
                            semanticsLabel: "Bayerische Ehrenamtskarte")),
                  ),
                  Flexible(
                    child: Padding(
                      padding: EdgeInsets.all(8.0 * scaleFactor),
                      child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text(
                              cardDetails.fullName,
                              style: TextStyle(
                                  fontSize: 14 * scaleFactor, color: textColor),
                              textAlign: TextAlign.start,
                            ),
                            RichText(
                                maxLines: 1,
                                text: TextSpan(
                                    text: "Gültig bis: ",
                                    style: TextStyle(
                                        fontSize: 12 * scaleFactor,
                                        color: textColor),
                                    children: [
                                      TextSpan(text: _formattedExpirationDate)
                                    ]))
                          ]),
                    ),
                  )
                ]),
              ),
            )
          ]);
    });
  }
}
