import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/intro_slides/location_request_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:intro_slider/intro_slider.dart';

typedef OnFinishedCallback = void Function();

class IntroScreen extends StatelessWidget {
  final OnFinishedCallback? onFinishedCallback;

  const IntroScreen({super.key, this.onFinishedCallback});

  void onDonePress(BuildContext context) {
    onFinishedCallback?.call();
    Navigator.of(context).pushReplacementNamed(homeRouteName);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return IntroSlider(
      onDonePress: () => onDonePress(context),
      renderDoneBtn: I18nText('done'),
      renderNextBtn: I18nText('next'),
      renderPrevBtn: I18nText('previous'),
      doneButtonStyle: Theme.of(context).textButtonTheme.style,
      indicatorConfig: IndicatorConfig(
        colorActiveIndicator: theme.colorScheme.primary,
        colorIndicator: Colors.grey,
      ),
      isShowSkipBtn: false,
      listContentConfig: [
        ContentConfig(
          title: buildConfig.introSlide1.title,
          description: buildConfig.introSlide1.description,
          pathImage: buildConfig.introSlide1.imagePath,
          backgroundColor:
              theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.background,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headlineSmall,
          styleDescription: theme.textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
        ),
        ContentConfig(
          title: buildConfig.introSlide2.title,
          description: buildConfig.introSlide2.description,
          pathImage: buildConfig.introSlide2.imagePath,
          backgroundColor:
              theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.background,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headlineSmall,
          styleDescription: theme.textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
        ),
        ContentConfig(
          title: buildConfig.introSlide3.title,
          description: buildConfig.introSlide3.description,
          pathImage: buildConfig.introSlide3.imagePath,
          backgroundColor:
              theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.background,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headlineSmall,
          styleDescription: theme.textTheme.bodyLarge?.apply(fontSizeFactor: 1.2),
        ),
        ContentConfig(
          title: buildConfig.introSlide4.title,
          backgroundColor:
              theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.colorScheme.background,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headlineSmall,
          pathImage: buildConfig.introSlide4.imagePath,
          widgetDescription: Center(
            child: Column(
              children: [
                Text(
                  buildConfig.introSlide4.description,
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
