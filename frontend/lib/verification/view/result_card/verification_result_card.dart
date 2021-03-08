import 'package:flutter/material.dart';

enum VerificationResultCardStyle {
  positive,
  negative,
  neutral
}

class VerificationResultCard extends StatelessWidget {
  final Widget child;
  final String title;
  final VerificationResultCardStyle style;

  VerificationResultCard({
    Key key,
    this.child,
    this.title,
    @required this.style
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
        child: Padding(
          padding: EdgeInsets.all(8),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: Icon(_icon, color: _color, size: 30),
                title: title != null ? Text(title) : null,
              ),
              if (child != null)
                child,
    ])));
  }

  IconData get _icon {
    switch (style) {
      case VerificationResultCardStyle.positive:
        return Icons.verified_user;
      case VerificationResultCardStyle.negative:
        return Icons.error;
      case VerificationResultCardStyle.neutral:
        return Icons.wb_cloudy;
    }
    return null;
  }

  Color get _color {
    switch (style) {
      case VerificationResultCardStyle.positive:
        return Colors.green;
      case VerificationResultCardStyle.negative:
        return Colors.red;
      case VerificationResultCardStyle.neutral:
        return null;
    }
    return null;
  }
}
