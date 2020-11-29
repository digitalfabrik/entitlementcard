// GENERATED CODE - DO NOT MODIFY BY HAND

import 'package:artemis/artemis.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:gql/ast.dart';
part 'graphql_api.g.dart';

@JsonSerializable(explicitToJson: true)
class AcceptingStores with EquatableMixin {
  AcceptingStores();

  factory AcceptingStores.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoresFromJson(json);

  List<AcceptingStore> acceptingStores;

  @override
  List<Object> get props => [acceptingStores];
  Map<String, dynamic> toJson() => _$AcceptingStoresToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStore with EquatableMixin {
  AcceptingStore();

  factory AcceptingStore.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreFromJson(json);

  int id;

  String name;

  @override
  List<Object> get props => [id, name];
  Map<String, dynamic> toJson() => _$AcceptingStoreToJson(this);
}

class AcceptingStoresQuery
    extends GraphQLQuery<AcceptingStores, JsonSerializable> {
  AcceptingStoresQuery();

  @override
  final DocumentNode document = DocumentNode(definitions: [
    OperationDefinitionNode(
        type: OperationType.query,
        name: NameNode(value: 'AcceptingStores'),
        variableDefinitions: [],
        directives: [],
        selectionSet: SelectionSetNode(selections: [
          FieldNode(
              name: NameNode(value: 'acceptingStores'),
              alias: null,
              arguments: [],
              directives: [],
              selectionSet: SelectionSetNode(selections: [
                FieldNode(
                    name: NameNode(value: 'id'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: null),
                FieldNode(
                    name: NameNode(value: 'name'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: null)
              ]))
        ]))
  ]);

  @override
  final String operationName = 'AcceptingStores';

  @override
  List<Object> get props => [document, operationName];
  @override
  AcceptingStores parse(Map<String, dynamic> json) =>
      AcceptingStores.fromJson(json);
}
