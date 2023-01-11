import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/identification/base_card_details.dart';
import 'package:ehrenamtskarte/identification/card/eak_card_header_logo.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

Color standardCardColor = getColorFromHex(buildConfig.cardBranding.colorStandard);
Color premiumCardColor = getColorFromHex(buildConfig.cardBranding.colorPremium);
Color textColor = getColorFromHex(buildConfig.cardBranding.bodyTextColor);
Color headerColor = getColorFromHex(buildConfig.cardBranding.headerColor);
String headerLogo = buildConfig.cardBranding.headerLogo;
String bodyLogo = buildConfig.cardBranding.bodyLogo;
String bodyLabel = buildConfig.cardBranding.bodyLabel;

class PaddingStyle {
  final double left;
  final double right;
  final double top;
  final double bottom;

  PaddingStyle(this.left, this.right, this.top, this.bottom);
}

PaddingStyle paddingBody = PaddingStyle(
  buildConfig.cardBranding.bodyContainerPadding.left.toDouble(),
  buildConfig.cardBranding.bodyContainerPadding.right.toDouble(),
  buildConfig.cardBranding.bodyContainerPadding.top.toDouble(),
  buildConfig.cardBranding.bodyContainerPadding.bottom.toDouble(),
);

PaddingStyle paddingHeader = PaddingStyle(
  buildConfig.cardBranding.headerContainerPadding.left.toDouble(),
  buildConfig.cardBranding.headerContainerPadding.right.toDouble(),
  buildConfig.cardBranding.headerContainerPadding.top.toDouble(),
  buildConfig.cardBranding.headerContainerPadding.bottom.toDouble(),
);

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

  const EakCard({super.key, required this.cardDetails, this.region});

  String get _formattedExpirationDate {
    final expirationDate = cardDetails.expirationDate;
    return expirationDate != null ? DateFormat('dd.MM.yyyy').format(expirationDate) : "unbegrenzt";
  }

  @override
  Widget build(BuildContext context) {
    final cardColor = cardDetails.cardType == CardType.gold ? premiumCardColor : standardCardColor;
    return LayoutBuilder(
      builder: (context, constraints) {
        final scaleFactor = constraints.maxWidth / 300;
        final currentRegion = region;
        final headerTitle = currentRegion != null
            ? "${currentRegion.prefix} ${currentRegion.name}"
            : buildConfig.cardBranding.headerTitleLeft;
        return Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            ColoredBox(
              color: headerColor,
              child: Padding(
                padding: EdgeInsets.only(
                  left: paddingHeader.left * scaleFactor,
                  right: paddingHeader.right * scaleFactor,
                  top: paddingHeader.top * scaleFactor,
                  bottom: paddingHeader.bottom * scaleFactor,
                ),
                child: AspectRatio(
                  aspectRatio: 6 / 1,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(child: EakCardHeaderLogo(title: headerTitle, scaleFactor: scaleFactor)),
                      Flexible(
                        child: EakCardHeaderLogo(
                          title: buildConfig.cardBranding.headerTitleRight,
                          scaleFactor: scaleFactor,
                          logo: Image(image: AssetImage(buildConfig.cardBranding.headerLogo), fit: BoxFit.contain),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            // Body
            Flexible(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  image: buildConfig.cardBranding.bodyBackgroundImage
                      ? DecorationImage(
                          image: AssetImage(buildConfig.cardBranding.bodyBackgroundImageUrl),
                          fit: BoxFit.fill,
                        )
                      : null,
                  gradient: RadialGradient(
                    center: const Alignment(-0.5, -0.6),
                    colors: [cardColor.withAlpha(100), cardColor],
                    radius: buildConfig.cardBranding.boxDecorationRadius.toDouble(),
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.only(
                    left: paddingBody.left * scaleFactor,
                    right: paddingBody.right * scaleFactor,
                    bottom: paddingBody.bottom * scaleFactor,
                    top: paddingBody.top * scaleFactor,
                  ),
                  child: Column(
                    children: [
                      AspectRatio(
                        aspectRatio: 6 / 1.2,
                        child: Align(
                          alignment: buildConfig.cardBranding.bodyLogoPosition == 'center'
                              ? Alignment.center
                              : Alignment.centerRight,
                          child: Image(image: AssetImage(buildConfig.cardBranding.bodyLogo)),
                        ),
                      ),
                      Flexible(
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
                    ],
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
