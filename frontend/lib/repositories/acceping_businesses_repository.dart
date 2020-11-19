class AcceptingBusinessesRepository {
  Future<List<String>> loadAcceptingBusinesses() {
    return Future.value(["1", "2"]);
  }

  Future saveAcceptingBusinesses(List<String> businesses) {
    return Future.value(null);
  }
}
