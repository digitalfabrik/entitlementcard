import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'qr_code_parser.dart';
import 'qr_code_scanner.dart';

class QRCodeScannerPage extends StatefulWidget {
  final QRCodeContentParser qrCodeContentParser;
  final String title;

  QRCodeScannerPage({Key key, @required this.qrCodeContentParser,
    @required this.title})
      : super(key: key);

  @override
  State<StatefulWidget> createState() =>
      _QRCodeScannerPageState();
}

class _QRCodeScannerPageState extends State<QRCodeScannerPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
          appBar: AppBar(
          title: Text(widget.title),
      ),
      body: QRCodeScanner(
        onCodeScanned: _onCodeScanned,
      )
    );
  }

  Future<void> _onCodeScanned(String code) async {
    final parseResult = widget.qrCodeContentParser(code);
    if (parseResult.hasError) {
      print("Failed to parse qr code content!");
      final errorMessage = parseResult.userErrorMessage;
      await _showErrorDialog(errorMessage);
    } else {
      Navigator.of(context).maybePop();
    }
  }

  Future<void> _showErrorDialog(String message) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (context) {
        return AlertDialog(
          title: Text('Fehler beim Lesen des Codes'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(message),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Ok'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

}
