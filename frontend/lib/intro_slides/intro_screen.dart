import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intro_slider/intro_slider.dart';
import 'package:intro_slider/slide_object.dart';

import 'location_request_button.dart';

typedef OnFinishedCallback = void Function();

class IntroScreen extends StatefulWidget {
  final OnFinishedCallback? onFinishedCallback;

  const IntroScreen({Key? key, this.onFinishedCallback}) : super(key: key);

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
          title: "Willkommen!",
          description: "Vielen Dank, dass Sie sich die App zur "
              "Bayerischen Ehrenamtskarte heruntergeladen haben!",
          pathImage: "assets/icon/icon_foreground.png",
          backgroundColor: theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.backgroundColor,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headline5,
          styleDescription: theme.textTheme.bodyText1?.apply(fontSizeFactor: 1.2)),
    );
    slides.add(
      Slide(
          title: "Wo kann ich meine Ehrenamtskarte nutzen?",
          description: "Auf der Karte von Bayern können Sie alle Akzeptanzstellen"
              " finden. Tippen Sie auf einen Standort, um mehr Informationen "
              "sehen zu können.",
          pathImage: "assets/intro_slides/map_zoom.jpeg",
          backgroundColor: theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.backgroundColor,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headline5,
          styleDescription: theme.textTheme.bodyText1?.apply(fontSizeFactor: 1.2)),
    );
    slides.add(
      Slide(
          title: "Finden Sie Akzeptanzstellen in Ihrer Umgebung!",
          backgroundColor: theme.brightness == Brightness.light ? const Color(0xffECECEC) : theme.backgroundColor,
          maxLineTitle: 3,
          styleTitle: theme.textTheme.headline5,
          pathImage: "assets/intro_slides/search_with_location.png",
          widgetDescription: Center(
            child: Column(children: [
              Text(
                "Wir können Ihren Standort auf der Karte anzeigen"
                " und Akzeptanzstellen in Ihrer Umgebung anzeigen. "
                "Wenn Sie diese Hilfen nutzen möchten, benötigen wir Ihre "
                "Zustimmung. Ihr Standort wird nicht gespeichert.",
                style: theme.textTheme.bodyText1?.apply(fontSizeFactor: 1.2),
                textAlign: TextAlign.center,
                maxLines: 100,
                overflow: TextOverflow.ellipsis,
              ),
              const Padding(
                padding: EdgeInsets.all(15),
                child: LocationRequestButton(),
              )
            ]),
          )),
    );
  }

  void onDonePress() {
    var onFinishedCallback = widget.onFinishedCallback;
    if (onFinishedCallback != null) {
      onFinishedCallback();
    }
    Navigator.of(context).pop();
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
