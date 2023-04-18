import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SettingsProvider extends StatefulWidget {
  final Widget child;

  const SettingsProvider({super.key, required this.child});

  @override
  State<StatefulWidget> createState() {
    return SettingsProviderState();
  }
}

class SettingsProviderState extends State<SettingsProvider> {
  final settings = SettingsModel();

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: settings.initialize(),
        builder: (context, snapshot) {
          final error = snapshot.error;
          if (error != null) {
            return ErrorMessage(error.toString());
          }
          if (snapshot.connectionState != ConnectionState.done) {
            return Container();
          }
          return ChangeNotifierProvider.value(value: settings, child: widget.child);
        });
  }
}
