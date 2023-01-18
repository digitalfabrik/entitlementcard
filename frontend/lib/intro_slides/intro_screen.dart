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
  List<Slide> slides = [];

  void _setSlides() {
    final theme = Theme.of(context);
    slides.clear();
    slides.add(
      Slide(
        title: buildConfig.introSlide1.title,
        description: buildConfig.introSlide1.description,
        pathImage: buildConfig.introSlide1.pathName,
        backgroundColor: theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.backgroundColor,
        maxLineTitle: 3,
        styleTitle: theme.textTheme.headline5,
        styleDescription: theme.textTheme.bodyText1?.apply(fontSizeFactor: 1.2),
      ),
    );
    slides.add(
      Slide(
        title: buildConfig.introSlide2.title,
        description: buildConfig.introSlide2.description,
        pathImage: buildConfig.introSlide2.pathName,
        backgroundColor: theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.backgroundColor,
        maxLineTitle: 3,
        styleTitle: theme.textTheme.headline5,
        styleDescription: theme.textTheme.bodyText1?.apply(fontSizeFactor: 1.2),
      ),
    );
    slides.add(
      Slide(
        title: buildConfig.introSlide3.title,
        description: buildConfig.introSlide3.description,
        pathImage: buildConfig.introSlide3.pathName,
        backgroundColor: theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.backgroundColor,
        maxLineTitle: 3,
        styleTitle: theme.textTheme.headline5,
        styleDescription: theme.textTheme.bodyText1?.apply(fontSizeFactor: 1.2),
      ),
    );
    slides.add(
      Slide(
        title: buildConfig.introSlide4.title,
        backgroundColor: theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.backgroundColor,
        maxLineTitle: 3,
        styleTitle: theme.textTheme.headline5,
        pathImage: buildConfig.introSlide4.pathName,
        widgetDescription: Center(
          child: Column(
            children: [
              Text(
                buildConfig.introSlide4.description,
                style: theme.textTheme.bodyText1?.apply(fontSizeFactor: 1.2),
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
    );
  }

  void onDonePress() {
    final onFinishedCallback = widget.onFinishedCallback;
    if (onFinishedCallback != null) {
      onFinishedCallback();
    }
    Navigator.of(context).pushReplacementNamed(homeRouteName);
  }

  @override
  Widget build(BuildContext context) {
    _setSlides();
    return IntroSlider(
      slides: slides,
      onDonePress: onDonePress,
      renderDoneBtn: const Text("Fertig"),
      renderNextBtn: const Text("Weiter"),
      renderPrevBtn: const Text("Zurück"),
      doneButtonStyle: Theme.of(context).textButtonTheme.style,
      showSkipBtn: false,
      colorDot: Theme.of(context).brightness == Brightness.light ? Colors.black54 : Colors.white38,
      colorActiveDot: Theme.of(context).brightness == Brightness.light ? Colors.black : Colors.white,
    );
  }
}
