import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/identification/id_card/card_header_logo.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

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

class CardContent extends StatelessWidget {
  final CardInfo cardInfo;
  final Region? region;
  final bool isExpired;
  final bool isNotYetValid;

  const CardContent(
      {super.key, required this.cardInfo, this.region, required this.isExpired, required this.isNotYetValid});

  String _getFormattedExpirationDate(BuildContext context) {
    final expirationDay = cardInfo.hasExpirationDay() ? cardInfo.expirationDay : null;
    return expirationDay != null
        ? DateFormat('dd.MM.yyyy').format(DateTime.fromMillisecondsSinceEpoch(0).add(Duration(days: expirationDay)))
        : t.identification.unlimited;
  }

  String? get _formattedBirthday {
    final birthday = cardInfo.extensions.hasExtensionBirthday() ? cardInfo.extensions.extensionBirthday.birthday : null;
    return birthday != null
        ? DateFormat('dd.MM.yyyy').format(DateTime.fromMillisecondsSinceEpoch(0).add(Duration(days: birthday)))
        : null;
  }

  String? get _passId {
    return cardInfo.extensions.hasExtensionNuernbergPassId()
        ? cardInfo.extensions.extensionNuernbergPassId.passId.toString()
        : null;
  }

  String? get _formattedStartDate {
    final startDay = cardInfo.extensions.hasExtensionStartDay() ? cardInfo.extensions.extensionStartDay.startDay : null;
    return startDay != null
        ? DateFormat('dd.MM.yyyy').format(DateTime.fromMillisecondsSinceEpoch(0).add(Duration(days: startDay)))
        : null;
  }

  String _getCardValidityDate(BuildContext context, String? startDate, String expirationDate) {
    final t = context.t;
    return startDate != null
        ? t.identification.validFromUntil(startDate: startDate, expirationDate: expirationDate)
        : t.identification.validUntil(expirationDate: expirationDate);
  }

  @override
  Widget build(BuildContext context) {
    final cardColor = cardInfo.extensions.extensionBavariaCardType.cardType == BavariaCardType.GOLD
        ? premiumCardColor
        : standardCardColor;
    final formattedBirthday = _formattedBirthday;
    final passId = _passId;
    final startDate = _formattedStartDate;
    return LayoutBuilder(
      builder: (context, constraints) {
        final scaleFactor = constraints.maxWidth / 300;
        final currentRegion = region;
        final headerLeftTitle = buildConfig.cardBranding.headerTitleLeft.isEmpty && currentRegion != null
            ? '${currentRegion.prefix} ${currentRegion.name}'
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
                child: SizedBox(
                  height: 50 * scaleFactor,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: CardHeaderLogo(
                          title: headerLeftTitle,
                          scaleFactor: scaleFactor,
                          alignment: CrossAxisAlignment.start,
                        ),
                      ),
                      Flexible(
                        child: CardHeaderLogo(
                          title: buildConfig.cardBranding.headerTitleRight,
                          scaleFactor: scaleFactor / buildConfig.cardBranding.headerLogoExtraScale,
                          logo: Image(
                            image: AssetImage(buildConfig.cardBranding.headerLogo),
                            width: buildConfig.cardBranding.headerLogoWidth * scaleFactor,
                            fit: BoxFit.contain,
                          ),
                          alignment: CrossAxisAlignment.end,
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
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      AspectRatio(
                        aspectRatio: 6 / 1.5,
                        child: Align(
                          alignment: buildConfig.cardBranding.bodyLogoPosition == 'center'
                              ? Alignment.center
                              : Alignment.centerRight,
                          child: Image(
                            image: AssetImage(buildConfig.cardBranding.bodyLogo),
                            width: buildConfig.cardBranding.bodyLogoWidth * scaleFactor,
                          ),
                        ),
                      ),
                      Flexible(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            FittedBox(
                              fit: BoxFit.scaleDown,
                              alignment: Alignment.topLeft,
                              child: Text(
                                cardInfo.fullName,
                                style: TextStyle(fontSize: 14 * scaleFactor, color: textColor),
                                textAlign: TextAlign.start,
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(top: 3.0),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  if (formattedBirthday != null)
                                    Text(
                                      formattedBirthday,
                                      style: TextStyle(fontSize: 14 * scaleFactor, color: textColor),
                                      textAlign: TextAlign.start,
                                    ),
                                  if (passId != null)
                                    Text(
                                      passId,
                                      style: TextStyle(fontSize: 14 * scaleFactor, color: textColor),
                                      textAlign: TextAlign.end,
                                    ),
                                ],
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.only(top: 3.0),
                              child: Text(
                                _getCardValidityDate(context, startDate, _getFormattedExpirationDate(context)),
                                style: TextStyle(
                                    fontSize: 14 * scaleFactor,
                                    color:
                                        isExpired || isNotYetValid ? Theme.of(context).colorScheme.error : textColor),
                                textAlign: TextAlign.start,
                              ),
                            ),
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
