import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/configuration/settings_model.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class BackendSwitchDialog extends StatefulWidget {
  final passwordToUnlock = 'wirschaffendas';
  const BackendSwitchDialog({super.key});

  static Future<void> show(BuildContext context) =>
      showDialog(context: context, barrierDismissible: false, builder: (_) => BackendSwitchDialog());

  @override
  BackendSwitchDialogState createState() => BackendSwitchDialogState();
}

class BackendSwitchDialogState extends State<BackendSwitchDialog> {
  String password = '';

  @override
  Widget build(BuildContext context) {
    return SimpleDialog(
      children: [
        Padding(
          padding: EdgeInsets.only(right: 10, left: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Switch Endpoint", style: Theme.of(context).textTheme.headlineMedium),
              IconButton(
                icon: const Icon(Icons.close),
                color: Theme.of(context).appBarTheme.backgroundColor,
                alignment: Alignment.topRight,
                onPressed: () {
                  Navigator.of(context, rootNavigator: true).pop();
                },
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(
            children: [
              Text(
                "Current Endpoint: \n${Configuration.of(context).graphqlUrl}",
                style: TextStyle(fontSize: 16, color: Theme.of(context).primaryColor),
              ),
              Padding(
                padding: EdgeInsets.only(top: 10, bottom: 10),
                child: TextField(
                  onChanged: (text) {
                    setState(() {
                      password = text;
                    });
                  },
                  decoration: InputDecoration(
                    hintText: 'Enter password...',
                  ),
                ),
              ),
              password.toLowerCase() == widget.passwordToUnlock
                  ? ElevatedButton(
                      style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(horizontal: 50, vertical: 20),
                          textStyle: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                      child: const Text("Switch API"),
                      onPressed: () => switchBackendUrl(context),
                    )
                  : Container(),
            ],
          ),
        ),
      ],
    );
  }

  void switchBackendUrl(BuildContext context) {
    final config = Configuration.of(context);
    final String endpoint = config.graphqlUrl;
    switch (endpoint) {
      case 'https://api.entitlementcard.app':
        {
          updateSettings(stagingEnabled: true);
          break;
        }
      case 'https://api.staging.entitlementcard.app':
        {
          updateSettings(stagingEnabled: false);
          break;
        }
    }
    Navigator.of(context, rootNavigator: true).pop();
  }

  void clearData() {
    final settings = Provider.of<SettingsModel>(context, listen: false);
    final card = Provider.of<UserCodeModel>(context, listen: false);
    settings.clearPreferences();
    card.removeCode();
  }

  void updateSettings({required bool stagingEnabled}) {
    final settings = Provider.of<SettingsModel>(context, listen: false);
    clearData();
    settings.setStaging(enabled: stagingEnabled);
  }
}
