import 'package:flutter/material.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import '../configuration/configuration.dart';

class BackendSwitchView extends StatelessWidget {
  const BackendSwitchView({super.key});

  @override
  Widget build(BuildContext context) {
    return SimpleDialog(
      children: [
        Center(child: Text("Enter Password", style: Theme.of(context).textTheme.headlineMedium)),
        Padding(
          padding: const EdgeInsets.all(15.0),
          child: Column(
            children: [
              Text("Current: ${Configuration.of(context).graphqlUrl}"),
              ListTile(
                title: Text("Switch to ${buildConfig.backendUrl.staging}"),
                onTap: () => switchBackendUrl(context),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // TODO add input field, make component stateful, checkPW, set correct switch label, rename backend switch view to dialog, fix Configuration class
  void switchBackendUrl(BuildContext context) {
    Configuration.of(context).setGraphqlUrl(url: buildConfig.backendUrl.staging);
  }

  static Future<void> show(BuildContext context) => showDialog(context: context, builder: (_) => BackendSwitchView());
}
