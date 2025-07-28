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
    final theme = Theme.of(context);
    return SimpleDialog(
      children: [
        Padding(
          padding: EdgeInsets.only(right: 10, left: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Switch Endpoint', style: theme.textTheme.titleLarge),
              IconButton(
                icon: const Icon(Icons.close),
                color: theme.appBarTheme.backgroundColor,
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
                'Current Endpoint: \n${Configuration.of(context).graphqlUrl}',
                style: theme.textTheme.bodyLarge?.apply(color: theme.hintColor),
              ),
              Padding(
                padding: EdgeInsets.only(top: 10, bottom: 10),
                child: TextField(
                  onChanged: (text) {
                    setState(() {
                      password = text;
                    });
                  },
                  decoration: InputDecoration(hintText: 'Enter password...'),
                ),
              ),
              password.toLowerCase() == widget.passwordToUnlock
                  ? ElevatedButton(child: Text('Switch API'), onPressed: () => switchBackendUrl(context))
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
    if (context.mounted) {
      Navigator.of(context, rootNavigator: true).pop();
    }
  }

  Future<void> clearData() async {
    final settings = Provider.of<SettingsModel>(context, listen: false);
    final userCodesModel = Provider.of<UserCodeModel>(context, listen: false);
    await settings.clearSettings();
    await userCodesModel.removeCodes();
  }
}
