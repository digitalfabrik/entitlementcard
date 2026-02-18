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
  late Future<void> settingsInitialization;

  @override
  void initState() {
    super.initState();
    settingsInitialization = settings.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: settingsInitialization,
      builder: (context, snapshot) {
        final error = snapshot.error;
        if (error != null) {
          return ErrorMessage(message: error.toString());
        }
        if (snapshot.connectionState != ConnectionState.done) {
          return Container();
        }
        return ChangeNotifierProvider.value(value: settings, child: widget.child);
      },
    );
  }
}
