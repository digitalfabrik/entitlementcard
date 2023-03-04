import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/entry_widget.dart';
import 'package:ehrenamtskarte/intro_slides/location_request_button.dart';
import 'package:flutter/material.dart';
import 'package:intro_slider/intro_slider.dart';

typedef OnFinishedCallback = void Function();

class IntroScreen extends StatefulWidget {
  final OnFinishedCallback? onFinishedCallback;

  const IntroScreen({super.key, this.onFinishedCallback});

  @override
  IntroScreenState createState() => IntroScreenState();
}

class IntroScreenState extends State<IntroScreen> {
  void onDonePress() {
    final onFinishedCallback = widget.onFinishedCallback;
    if (onFinishedCallback != null) {
      onFinishedCallback();
    }
    Navigator.of(context).pushReplacementNamed(homeRouteName);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return IntroSlider(
      onDonePress: onDonePress,
      renderDoneBtn: const Text("Fertig"),
      renderNextBtn: const Text("Weiter"),
      renderPrevBtn: const Text("Zurück"),
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
