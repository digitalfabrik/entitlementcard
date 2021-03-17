import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class FormText extends StatelessWidget {
  final String text;

  const FormText(this.text, {Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: Theme.of(context).textTheme.subtitle1,
    );
  }
}
