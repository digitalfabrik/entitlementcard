import 'package:flutter/widgets.dart';

const bavariaFontColor = Color(0xff008dc9);

class EakCardHeaderLogo extends StatelessWidget {
  final String title;
  final Image? logo;
  final double scaleFactor;

  const EakCardHeaderLogo(
      {Key? key, required this.title, this.logo, required this.scaleFactor})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(4.0 * scaleFactor),
      child: Column(children: [
        Flexible(
            child: Padding(
          padding: EdgeInsets.all(2 * scaleFactor),
          child: logo ?? Container(),
        )),
        Text(title,
            maxLines: 1,
            style:
                TextStyle(fontSize: 8 * scaleFactor, color: bavariaFontColor))
      ]),
    );
  }
}
