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
        onCodeScanned: (code) => _onCodeScanned(context, code),
      )
    );
  }

  Future<void> _onCodeScanned(BuildContext context, String code) async {
    try {
      widget.qrCodeContentParser(code);
    } on QRCodeParseException catch (e) {
      print(e);
    }

    Navigator.of(context).maybePop();
  }
}
