import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intro_slider/intro_slider.dart';
import 'package:intro_slider/slide_object.dart';

class IntroScreen extends StatefulWidget {
  IntroScreen({Key key}) : super(key: key);

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
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, "
            "sed diam nonumy eirmod tempor invidunt ut labore et dolore magna "
            "aliquyam",
        pathImage: "assets/icon/icon.png",
        backgroundColor: Color(0xfff5a623),
      ),
    );
    slides.add(
      Slide(
        title: "Akzeptanzstellen finden",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, "
            "sed diam nonumy eirmod tempor invidunt ut labore et dolore magna "
            "aliquyam",
        pathImage: "assets/icon/icon.png",
        backgroundColor: Color(0xff203152),
      ),
    );
    slides.add(
      Slide(
        title: "Bewerbung für die EAK",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, "
            "sed diam nonumy eirmod tempor invidunt ut labore et dolore magna "
            "aliquyam",
        pathImage: "assets/icon/icon.png",
        backgroundColor: Color(0xff9932CC),
      ),
    );
    slides.add(
      Slide(
        title: "Datenschutz und Location Permission",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, "
            "sed diam nonumy eirmod tempor invidunt ut labore et dolore magna "
            "aliquyam",
        pathImage: "assets/icon/icon.png",
        backgroundColor: Color(0xff1c8fc2),
      ),
    );
  }

  void onDonePress() {
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
