class Secret {
  final String mapboxKey;

  Secret({this.mapboxKey = ""});

  factory Secret.fromJson(Map<String, dynamic> jsonMap) {
    return new Secret(mapboxKey: jsonMap["mapbox_key"]);
  }
}
