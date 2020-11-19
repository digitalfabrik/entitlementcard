import 'dart:async';
import 'dart:collection';

import 'package:flutter/widgets.dart';
import 'package:meta/meta.dart';

import '../repositories/acceping_businesses_repository.dart';

class AcceptingBusinessesModel extends ChangeNotifier {
  final AcceptingBusinessesRepository repository;

  List<String> _acceptingBusinesses;

  UnmodifiableListView<String> get acceptingBusinesses =>
      UnmodifiableListView(_acceptingBusinesses);

  bool _isLoading = false;

  bool get isLoading => _isLoading;

  AcceptingBusinessesModel({
    @required this.repository,
    List<String> businesses,
  }) : _acceptingBusinesses = businesses ?? [];

  Future loadAcceptingBusinesses() {
    _isLoading = true;
    notifyListeners();

    return repository.loadAcceptingBusinesses().then((loadedBusinesses) {
      _acceptingBusinesses.addAll(loadedBusinesses);
      _isLoading = false;
      notifyListeners();
    }).catchError((err) {
      _isLoading = false;
      notifyListeners();
    });
  }

  List<String> get filteredAcceptingBusinesses {
    return _acceptingBusinesses.where((business) {
      if (true) {
        return true;
      }
    }).toList();
  }

  void removeTodo(String business) {
    _acceptingBusinesses.removeWhere((it) => it == business);
    notifyListeners();
  }
}
