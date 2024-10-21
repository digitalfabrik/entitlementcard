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
              Text('Switch Endpoint', style: Theme.of(context).textTheme.headlineMedium),
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
              Text('Current Endpoint: \n${Configuration.of(context).graphqlUrl}',
                  style: Theme.of(context).textTheme.bodyMedium),
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
                      child: const Text('Switch API'),
                      onPressed: () => switchBackendUrl(context),
                    )
                  : Container(),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> switchBackendUrl(BuildContext context) async {
    final settings = Provider.of<SettingsModel>(context, listen: false);
    final updatedEnableStaging = !settings.enableStaging;
    await clearData();
    await settings.setEnableStaging(enabled: updatedEnableStaging);
    Navigator.of(context, rootNavigator: true).pop();
  }

  Future<void> clearData() async {
    final settings = Provider.of<SettingsModel>(context, listen: false);
    final userCodesModel = Provider.of<UserCodeModel>(context, listen: false);
    await settings.clearSettings();
    await userCodesModel.removeCodes();
  }
}
