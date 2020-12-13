import 'package:flutter/widgets.dart';

class Configuration extends InheritedWidget {
  final String mapStyleUrl;
  final String graphqlUrl;

  const Configuration({
    Key key,
    @required this.mapStyleUrl,
    @required this.graphqlUrl,
    @required Widget child,
  })  : assert(mapStyleUrl != null),
        assert(graphqlUrl != null),
        super(key: key, child: child);

  @override
  bool updateShouldNotify(covariant Configuration oldWidget) =>
      mapStyleUrl != oldWidget.mapStyleUrl ||
      graphqlUrl != oldWidget.graphqlUrl;

  static Configuration of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<Configuration>();
}
