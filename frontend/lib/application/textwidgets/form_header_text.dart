import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class FormHeaderText extends StatelessWidget {
  final String text;

  const FormHeaderText(this.text, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: Theme.of(context).textTheme.subtitle1?.apply(fontWeightDelta: 1),
    );
  }
}
