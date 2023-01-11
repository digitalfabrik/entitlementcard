import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:flutter/widgets.dart';

Color textColor = getColorFromHex(buildConfig.cardBranding.headerTextColor);
int fontSize = buildConfig.cardBranding.headerTextFontSize;
double logoPadding = buildConfig.cardBranding.headerLogoPadding.toDouble();

class EakCardHeaderLogo extends StatelessWidget {
  final String title;
  final Image? logo;
  final double scaleFactor;

  const EakCardHeaderLogo({super.key, required this.title, this.logo, required this.scaleFactor});

  @override
  Widget build(BuildContext context) {
    return Padding(padding: EdgeInsets.all(logoPadding * scaleFactor),child:Column(
      children: [
        Flexible(
          child: logo ?? Container(),
        ),
        Text(title, maxLines: 3, style: TextStyle(fontSize: fontSize * scaleFactor, color: textColor))
      ],
    ),
    );
  }
}
