import 'package:flutter/widgets.dart';

class Configuration extends InheritedWidget {
  final String mapStyleUrl;
  final String graphqlUrl;
  final bool showVerification;

  const Configuration({
    Key key,
    @required this.mapStyleUrl,
    @required this.graphqlUrl,
    @required this.showVerification,
    @required Widget child,
  })  : assert(mapStyleUrl != null),
        assert(graphqlUrl != null),
        super(key: key, child: child);

  @override
  bool updateShouldNotify(covariant Configuration oldWidget) =>
      mapStyleUrl != oldWidget.mapStyleUrl ||
      graphqlUrl != oldWidget.graphqlUrl ||
      showVerification != oldWidget.showVerification;

  static Configuration of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<Configuration>();
}
