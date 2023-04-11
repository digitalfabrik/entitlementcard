import 'package:flutter/widgets.dart';

class _Configuration extends InheritedWidget {
  final StateConfigurationState configuration;

  _Configuration({
    required this.configuration,
    required Widget child,
  }) : super(child: child);

  @override
  bool updateShouldNotify(covariant _Configuration oldWidget) =>
      configuration.mapStyleUrl != oldWidget.configuration.mapStyleUrl ||
      configuration.graphqlUrl != oldWidget.configuration.graphqlUrl ||
      configuration.projectId != oldWidget.configuration.projectId ||
      configuration.showDevSettings != oldWidget.configuration.showDevSettings;
}

class Configuration extends StatefulWidget {
  final Widget child;
  final String mapStyleUrl;
  final String graphqlUrl;
  final String projectId;
  final bool showDevSettings;

  const Configuration({
    super.key,
    required this.mapStyleUrl,
    required this.graphqlUrl,
    required this.projectId,
    required this.showDevSettings,
    required this.child,
  });

  static StateConfigurationState of(BuildContext context) {
    final configurationContext = context.dependOnInheritedWidgetOfExactType<_Configuration>();
    if (configurationContext == null) {
      throw Exception("Config was not found in component tree!");
    }
    return configurationContext.configuration;
  }

  @override
  StateConfigurationState createState() => StateConfigurationState();
}

class StateConfigurationState extends State<Configuration> {
  late String mapStyleUrl;
  late String graphqlUrl;
  late String projectId;
  late bool showDevSettings;

  @override
  void initState() {
    super.initState();
    mapStyleUrl = widget.mapStyleUrl;
    graphqlUrl = widget.graphqlUrl;
    projectId = widget.projectId;
    showDevSettings = widget.showDevSettings;
  }

  void updateGraphqlUrl(String url) {
    setState(() {
      graphqlUrl = url;
    });
  }

  @override
  Widget build(BuildContext context) {
    return _Configuration(
      configuration: this,
      child: widget.child,
    );
  }
}
