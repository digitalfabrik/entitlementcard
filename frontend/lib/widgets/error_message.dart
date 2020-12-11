import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ErrorMessage extends StatelessWidget {
  final String _message;

  ErrorMessage(this._message);

  @override
  Widget build(BuildContext context) {
    return Row(children: <Widget>[
      Icon(Icons.warning, color: Colors.orange),
      SizedBox(width: 10),
      Expanded(
          child: Text(
        _message,
        maxLines: 4,
        overflow: TextOverflow.ellipsis,
      ))
    ]);
  }
}
