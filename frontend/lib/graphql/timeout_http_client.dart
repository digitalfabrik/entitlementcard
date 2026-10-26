import 'package:http/http.dart' as http;

/// Applies a timeout to each request until the response headers are received.
/// Used instead of the queryRequestTimeout of the graphql package, which throws "Future already completed"
/// if a response arrives after the timeout (https://github.com/zino-hofmann/graphql-flutter/issues/1525).
/// Should be removed with https://github.com/digitalfabrik/entitlementcard/issues/3219
class TimeoutHttpClient extends http.BaseClient {
  final http.Client _inner;
  final Duration timeout;

  TimeoutHttpClient(this._inner, {required this.timeout});

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) => _inner.send(request).timeout(timeout);

  @override
  void close() => _inner.close();
}
