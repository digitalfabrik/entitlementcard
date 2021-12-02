import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';

import '../base_card_details.dart';
import 'eak_card_header_logo.dart';

const blueCardColor = Color(0xffcfeaff);
const goldenCardColor = Color(0xffcab374);
const textColor = Color(0xff172c82);

class Region with EquatableMixin {
  final String prefix;
  final String name;

  Region(this.prefix, this.name);

  @override
  List<Object> get props => [prefix, name];
}

class EakCard extends StatelessWidget {
  final BaseCardDetails cardDetails;
  final Region? region;

  const EakCard({Key? key, required this.cardDetails, this.region}) : super(key: key);

  String get _formattedExpirationDate {
    final expirationDate = cardDetails.expirationDate;
    return expirationDate != null ? DateFormat('dd.MM.yyyy').format(expirationDate) : "unbegrenzt";
  }

  @override
  Widget build(BuildContext context) {
    final cardColor = cardDetails.cardType == CardType.gold ? goldenCardColor : blueCardColor;
    return LayoutBuilder(
      builder: (context, constraints) {
        final scaleFactor = constraints.maxWidth / 300;
        final currentRegion = region;
        final headerTitle = currentRegion != null ? "${currentRegion.prefix} ${currentRegion.name}" : "";
        return Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              color: const Color(0xf5f5f5ff),
              child: AspectRatio(
                aspectRatio: 6 / 1,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    EakCardHeaderLogo(title: headerTitle, scaleFactor: scaleFactor),
                    EakCardHeaderLogo(
                      title: "Freistaat Bayern",
                      scaleFactor: scaleFactor,
                      logo: const Image(image: AssetImage("assets/wappen-bavaria.png"), fit: BoxFit.contain),
                    )
                  ],
                ),
              ),
            ),
            // Body
            Flexible(
              child: Container(
                decoration:
                    BoxDecoration(gradient: RadialGradient(colors: [cardColor.withAlpha(100), cardColor], radius: 1)),
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.all(8 * scaleFactor),
                      child: AspectRatio(
                        aspectRatio: 6 / 1.2,
                        child:
                            SvgPicture.asset("assets/eak-lettering.svg", semanticsLabel: "Bayerische Ehrenamtskarte"),
                      ),
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
                              style: TextStyle(fontSize: 14 * scaleFactor, color: textColor),
                              textAlign: TextAlign.start,
                            ),
                            RichText(
                              maxLines: 1,
                              text: TextSpan(
                                text: "Gültig bis: ",
                                style: TextStyle(fontSize: 12 * scaleFactor, color: textColor),
                                children: [TextSpan(text: _formattedExpirationDate)],
                              ),
                            )
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
            )
          ],
        );
      },
    );
  }
}
