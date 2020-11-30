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

  List<AcceptingStoreName> acceptingStoreName;

  @override
  List<Object> get props => [acceptingStoreName];

  Map<String, dynamic> toJson() => _$AcceptingStoresToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreName with EquatableMixin {
  AcceptingStoreName();

  factory AcceptingStoreName.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreNameFromJson(json);

  int id;

  String name;

  @override
  List<Object> get props => [id, name];

  Map<String, dynamic> toJson() => _$AcceptingStoreNameToJson(this);
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
              alias: NameNode(value: 'acceptingStoreName'),
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

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById with EquatableMixin {
  AcceptingStoreById();

  factory AcceptingStoreById.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreByIdFromJson(json);

  List<AcceptingStore> acceptingStoreById;

  @override
  List<Object> get props => [acceptingStoreById];

  Map<String, dynamic> toJson() => _$AcceptingStoreByIdToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStore with EquatableMixin {
  AcceptingStore();

  factory AcceptingStore.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreFromJson(json);

  int id;

  String name;

  Category category;

  Contact contact;

  PhysicalStore phyiscalStore;

  @override
  List<Object> get props => [id, name, category, contact, phyiscalStore];

  Map<String, dynamic> toJson() => _$AcceptingStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class Category with EquatableMixin {
  Category();

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);

  String name;

  @override
  List<Object> get props => [name];

  Map<String, dynamic> toJson() => _$CategoryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class Contact with EquatableMixin {
  Contact();

  factory Contact.fromJson(Map<String, dynamic> json) =>
      _$ContactFromJson(json);

  String email;

  String telephone;

  String website;

  @override
  List<Object> get props => [email, telephone, website];

  Map<String, dynamic> toJson() => _$ContactToJson(this);
}

@JsonSerializable(explicitToJson: true)
class PhysicalStore with EquatableMixin {
  PhysicalStore();

  factory PhysicalStore.fromJson(Map<String, dynamic> json) =>
      _$PhysicalStoreFromJson(json);

  Address address;

  @override
  List<Object> get props => [address];

  Map<String, dynamic> toJson() => _$PhysicalStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class Address with EquatableMixin {
  Address();

  factory Address.fromJson(Map<String, dynamic> json) =>
      _$AddressFromJson(json);

  Coordinates coordinates;

  String houseNumber;

  String street;

  String postalCode;

  String location;

  String state;

  @override
  List<Object> get props =>
      [coordinates, houseNumber, street, postalCode, location, state];

  Map<String, dynamic> toJson() => _$AddressToJson(this);
}

@JsonSerializable(explicitToJson: true)
class Coordinates with EquatableMixin {
  Coordinates();

  factory Coordinates.fromJson(Map<String, dynamic> json) =>
      _$CoordinatesFromJson(json);

  double latitude;

  double longitude;

  @override
  List<Object> get props => [latitude, longitude];

  Map<String, dynamic> toJson() => _$CoordinatesToJson(this);
}

@JsonSerializable(explicitToJson: true)
class ParamsInput with EquatableMixin {
  ParamsInput();

  factory ParamsInput.fromJson(Map<String, dynamic> json) =>
      _$ParamsInputFromJson(json);

  List<int> ids;

  @override
  List<Object> get props => [ids];

  Map<String, dynamic> toJson() => _$ParamsInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreByIdArguments extends JsonSerializable with EquatableMixin {
  AcceptingStoreByIdArguments({this.ids});

  factory AcceptingStoreByIdArguments.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreByIdArgumentsFromJson(json);

  final ParamsInput ids;

  @override
  List<Object> get props => [ids];

  Map<String, dynamic> toJson() => _$AcceptingStoreByIdArgumentsToJson(this);
}

class AcceptingStoreByIdQuery
    extends GraphQLQuery<AcceptingStoreById, AcceptingStoreByIdArguments> {
  AcceptingStoreByIdQuery({this.variables});

  @override
  final DocumentNode document = DocumentNode(definitions: [
    OperationDefinitionNode(
        type: OperationType.query,
        name: NameNode(value: 'AcceptingStoreById'),
        variableDefinitions: [
          VariableDefinitionNode(
              variable: VariableNode(name: NameNode(value: 'ids')),
              type: NamedTypeNode(
                  name: NameNode(value: 'ParamsInput'), isNonNull: true),
              defaultValue: DefaultValueNode(value: null),
              directives: [])
        ],
        directives: [],
        selectionSet: SelectionSetNode(selections: [
          FieldNode(
              name: NameNode(value: 'acceptingStoreById'),
              alias: null,
              arguments: [
                ArgumentNode(
                    name: NameNode(value: 'params'),
                    value: VariableNode(name: NameNode(value: 'ids')))
              ],
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
                    selectionSet: null),
                FieldNode(
                    name: NameNode(value: 'category'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: SelectionSetNode(selections: [
                      FieldNode(
                          name: NameNode(value: 'name'),
                          alias: null,
                          arguments: [],
                          directives: [],
                          selectionSet: null)
                    ])),
                FieldNode(
                    name: NameNode(value: 'contact'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: SelectionSetNode(selections: [
                      FieldNode(
                          name: NameNode(value: 'email'),
                          alias: null,
                          arguments: [],
                          directives: [],
                          selectionSet: null),
                      FieldNode(
                          name: NameNode(value: 'telephone'),
                          alias: null,
                          arguments: [],
                          directives: [],
                          selectionSet: null),
                      FieldNode(
                          name: NameNode(value: 'website'),
                          alias: null,
                          arguments: [],
                          directives: [],
                          selectionSet: null)
                    ])),
                FieldNode(
                    name: NameNode(value: 'phyiscalStore'),
                    alias: null,
                    arguments: [],
                    directives: [],
                    selectionSet: SelectionSetNode(selections: [
                      FieldNode(
                          name: NameNode(value: 'address'),
                          alias: null,
                          arguments: [],
                          directives: [],
                          selectionSet: SelectionSetNode(selections: [
                            FieldNode(
                                name: NameNode(value: 'coordinates'),
                                alias: null,
                                arguments: [],
                                directives: [],
                                selectionSet: SelectionSetNode(selections: [
                                  FieldNode(
                                      name: NameNode(value: 'latitude'),
                                      alias: null,
                                      arguments: [],
                                      directives: [],
                                      selectionSet: null),
                                  FieldNode(
                                      name: NameNode(value: 'longitude'),
                                      alias: null,
                                      arguments: [],
                                      directives: [],
                                      selectionSet: null)
                                ])),
                            FieldNode(
                                name: NameNode(value: 'houseNumber'),
                                alias: null,
                                arguments: [],
                                directives: [],
                                selectionSet: null),
                            FieldNode(
                                name: NameNode(value: 'street'),
                                alias: null,
                                arguments: [],
                                directives: [],
                                selectionSet: null),
                            FieldNode(
                                name: NameNode(value: 'postalCode'),
                                alias: null,
                                arguments: [],
                                directives: [],
                                selectionSet: null),
                            FieldNode(
                                name: NameNode(value: 'location'),
                                alias: null,
                                arguments: [],
                                directives: [],
                                selectionSet: null),
                            FieldNode(
                                name: NameNode(value: 'state'),
                                alias: null,
                                arguments: [],
                                directives: [],
                                selectionSet: null)
                          ]))
                    ]))
              ]))
        ]))
  ]);

  @override
  final String operationName = 'AcceptingStoreById';

  @override
  final AcceptingStoreByIdArguments variables;

  @override
  List<Object> get props => [document, operationName, variables];

  @override
  AcceptingStoreById parse(Map<String, dynamic> json) =>
      AcceptingStoreById.fromJson(json);
}
