import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intro_slider/intro_slider.dart';
import 'package:intro_slider/slide_object.dart';

import '../location/determine_position.dart';

typedef OnFinishedCallback = void Function();

class IntroScreen extends StatefulWidget {
  final OnFinishedCallback onFinishedCallback;

  const IntroScreen({Key key, this.onFinishedCallback}) : super(key: key);

  @override
  IntroScreenState createState() => IntroScreenState();
}

class IntroScreenState extends State<IntroScreen> {
  List<Slide> slides = [];

  @override
  void initState() {
    super.initState();

    slides.add(
      Slide(
        title: "Willkommen!",
        description: "Danke für Ihr ehrenamtliches Engagement! Nutzen Sie Ihre "
            "Vorteile als InhaberIn der bayerischen Ehrenamtskarte "
            "bestmöglich mit den Funktionen dieser App.",
        pathImage: "assets/icon/icon.png",
        backgroundColor: Color(0xff8377A9),
        maxLineTitle: 3,
      ),
    );
    slides.add(
      Slide(
        title: "Wo kann ich meine Ehrenamtskarte nutzen?",
        description: "Auf der Karte von Bayern können Sie alle Akzeptanzstellen"
            " finden. Durch Vergrößern der Karte mit zwei Fingern bekommen Sie"
            " einen genaueren Blick auf die Standorte. Tippen Sie auf einen"
            " Standort, um mehr Informationen sehen zu können.",
        pathImage: "assets/icon/icon.png",
        backgroundColor: Color(0xff203152),
        maxLineTitle: 3,
      ),
    );
    slides.add(
      Slide(
        title: "Sie haben noch keine Ehrenamtskarte?",
        description: "Wenn Sie ehrenamtlich tätig sind und alle Voraussetzungen"
            " erfüllen, können Sie sich bequem über diese App für eine"
            " Ehrenamtskarte in Bayern bewerben.",
        pathImage: "assets/icon/icon.png",
        backgroundColor: Color(0xff9932CC),
        maxLineTitle: 3,
      ),
    );
    slides.add(
      Slide(
          title: "Finden Sie Akzeptanzstellen in Ihrer Umgebung!",
          description:
              "Wir können Ihren Standort für Sie auf der Karte anzeigen"
              " und Suchergebnisse nach der Entfernung zu Ihnen sortieren. "
              "Wenn Sie diese optionalen Hilfen benutzen möchten, "
              "dann benötigen wir Ihre Zustimmung.",
          backgroundColor: Color(0xff1c8fc2),
          maxLineTitle: 3,
          centerWidget: Center(
            child: ElevatedButton(
              onPressed: _onLocationButtonClicked,
              child: Text("Ich möchte meinen Standort freigeben."),
            ),
          )),
    );
  }

  void _onLocationButtonClicked() {
    requestPermissionToDeterminePosition(userInteractContext: context);
  }

  void onDonePress() {
    if (widget.onFinishedCallback != null) {
      widget.onFinishedCallback();
    }
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    return IntroSlider(
      slides: slides,
      onDonePress: onDonePress,
      nameDoneBtn: "Fertig",
      nameNextBtn: "Weiter",
      nameSkipBtn: "Überspringen",
      widthSkipBtn: 120,
    );
  }
}
