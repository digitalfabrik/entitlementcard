import 'package:flutter/material.dart';

class AppRoute extends MaterialPageRoute {
  AppRoute({required builder, settings})
      : super(
            settings: settings,
            builder: (BuildContext context) =>
                Material(child: builder(context)));
}
