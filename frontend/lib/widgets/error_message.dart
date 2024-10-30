import 'package:flutter/material.dart';

class ErrorMessage extends StatelessWidget {
  final String _message;

  const ErrorMessage(this._message, {super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(Icons.warning, color: Colors.orange),
        const SizedBox(width: 10),
        Expanded(child: Text(_message, style: Theme.of(context).textTheme.bodyMedium)),
        const Icon(Icons.replay)
      ],
    );
  }
}
