import 'package:flutter/widgets.dart';

class Configuration extends InheritedWidget {
  final String mapStyleUrl;
  String graphqlUrl;
  final String projectId;
  final bool showDevSettings;

  Configuration({
    super.key,
    required this.mapStyleUrl,
    required this.graphqlUrl,
    required this.projectId,
    required this.showDevSettings,
    required super.child,
  });

  @override
  bool updateShouldNotify(covariant Configuration oldWidget) =>
      mapStyleUrl != oldWidget.mapStyleUrl ||
      graphqlUrl != oldWidget.graphqlUrl ||
      projectId != oldWidget.projectId ||
      showDevSettings != oldWidget.showDevSettings;

  void setGraphqlUrl({required String url}) {
    graphqlUrl = url;
  }

  static Configuration of(BuildContext context) {
    final configuration = context.dependOnInheritedWidgetOfExactType<Configuration>();
    if (configuration == null) {
      throw Exception("Config was not found in component tree!");
    }
    return configuration;
  }
}
