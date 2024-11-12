import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/intro_slides/location_request_button.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intro_slider/intro_slider.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

import 'package:ehrenamtskarte/app.dart';

typedef OnFinishedCallback = void Function();

class IntroScreen extends StatelessWidget {
  final OnFinishedCallback? onFinishedCallback;

  const IntroScreen({super.key, this.onFinishedCallback});

  void onDonePress(BuildContext context) {
    onFinishedCallback?.call();
    GoRouter.of(context).pushReplacement(homeRouteName);
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    return IntroSlider(
      onDonePress: () => onDonePress(context),
      renderDoneBtn: Text(t.common.done),
      renderNextBtn: Text(t.common.next),
      renderPrevBtn: Text(t.common.previous),
      indicatorConfig: IndicatorConfig(
        colorActiveIndicator: theme.colorScheme.primary,
        colorIndicator: Colors.grey,
      ),
      isShowSkipBtn: false,
      listContentConfig: [
        ContentConfig(
          title: t.intro.welcomeTitle,
          description: t.intro.welcomeDescription,
          pathImage: buildConfig.introSlidesImages[0],
          backgroundColor:
              theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.background,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headlineSmall,
          styleDescription: theme.textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
        ),
        ContentConfig(
          title: t.intro.applyTitle,
          description: t.intro.applyDescription,
          pathImage: buildConfig.introSlidesImages[1],
          backgroundColor:
              theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.background,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headlineSmall,
          styleDescription: theme.textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
        ),
        ContentConfig(
          title: t.intro.usageTitle,
          description: t.intro.usageDescription,
          pathImage: buildConfig.introSlidesImages[2],
          backgroundColor:
              theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.background,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headlineSmall,
          styleDescription: theme.textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
        ),
        ContentConfig(
          title: t.intro.locationTitle,
          backgroundColor:
              theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.background,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headlineSmall,
          pathImage: buildConfig.introSlidesImages[3],
          widgetDescription: Center(
            child: Column(
              children: [
                Text(
                  t.intro.locationDescription,
                  style: theme.textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
                  textAlign: TextAlign.center,
                  maxLines: 100,
                  overflow: TextOverflow.ellipsis,
                ),
                const Padding(
                  padding: EdgeInsets.all(15),
                  child: LocationRequestButton(),
                )
              ],
            ),
          ),
        ),
      ],
    );
  }
}
