import 'package:flutter/widgets.dart';

class Configuration extends InheritedWidget {
  final String mapStyleUrl;
  final String graphqlStoresUrl;
  final String graphqlVerificationUrl;

  const Configuration({
    Key key,
    @required this.mapStyleUrl,
    @required this.graphqlStoresUrl,
    @required this.graphqlVerificationUrl,
    @required Widget child,
  })  : assert(mapStyleUrl != null),
        assert(graphqlStoresUrl != null),
        super(key: key, child: child);

  @override
  bool updateShouldNotify(covariant Configuration oldWidget) =>
      mapStyleUrl != oldWidget.mapStyleUrl ||
      graphqlStoresUrl != oldWidget.graphqlStoresUrl;

  static Configuration of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<Configuration>();
}
