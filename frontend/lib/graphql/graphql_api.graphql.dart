// GENERATED CODE - DO NOT MODIFY BY HAND

import 'package:meta/meta.dart';
import 'package:artemis/artemis.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:gql/ast.dart';
part 'graphql_api.graphql.g.dart';

@JsonSerializable(explicitToJson: true)
class AcceptingStores$Query$AcceptingStoreName with EquatableMixin {
  AcceptingStores$Query$AcceptingStoreName();

  factory AcceptingStores$Query$AcceptingStoreName.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStores$Query$AcceptingStoreNameFromJson(json);

  int id;

  String name;

  @override
  List<Object> get props => [id, name];
  Map<String, dynamic> toJson() =>
      _$AcceptingStores$Query$AcceptingStoreNameToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStores$Query with EquatableMixin {
  AcceptingStores$Query();

  factory AcceptingStores$Query.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStores$QueryFromJson(json);

  List<AcceptingStores$Query$AcceptingStoreName> acceptingStoreName;

  @override
  List<Object> get props => [acceptingStoreName];
  Map<String, dynamic> toJson() => _$AcceptingStores$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$AcceptingStore$Category with EquatableMixin {
  AcceptingStoreById$Query$AcceptingStore$Category();

  factory AcceptingStoreById$Query$AcceptingStore$Category.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$AcceptingStore$CategoryFromJson(json);

  int id;

  String name;

  @override
  List<Object> get props => [id, name];
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$AcceptingStore$CategoryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$AcceptingStore$Contact with EquatableMixin {
  AcceptingStoreById$Query$AcceptingStore$Contact();

  factory AcceptingStoreById$Query$AcceptingStore$Contact.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$AcceptingStore$ContactFromJson(json);

  String email;

  String telephone;

  String website;

  @override
  List<Object> get props => [email, telephone, website];
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$AcceptingStore$ContactToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$Coordinates
    with EquatableMixin {
  AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$Coordinates();

  factory AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$Coordinates.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$CoordinatesFromJson(
          json);

  double latitude;

  double longitude;

  @override
  List<Object> get props => [latitude, longitude];
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$CoordinatesToJson(
          this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address
    with EquatableMixin {
  AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address();

  factory AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$AcceptingStore$PhysicalStore$AddressFromJson(
          json);

  AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$Coordinates
      coordinates;

  String houseNumber;

  String street;

  String postalCode;

  String location;

  String state;

  @override
  List<Object> get props =>
      [coordinates, houseNumber, street, postalCode, location, state];
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$AcceptingStore$PhysicalStore$AddressToJson(
          this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$AcceptingStore$PhysicalStore
    with EquatableMixin {
  AcceptingStoreById$Query$AcceptingStore$PhysicalStore();

  factory AcceptingStoreById$Query$AcceptingStore$PhysicalStore.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$AcceptingStore$PhysicalStoreFromJson(json);

  AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address address;

  @override
  List<Object> get props => [address];
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$AcceptingStore$PhysicalStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$AcceptingStore with EquatableMixin {
  AcceptingStoreById$Query$AcceptingStore();

  factory AcceptingStoreById$Query$AcceptingStore.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$AcceptingStoreFromJson(json);

  int id;

  String name;

  AcceptingStoreById$Query$AcceptingStore$Category category;

  AcceptingStoreById$Query$AcceptingStore$Contact contact;

  AcceptingStoreById$Query$AcceptingStore$PhysicalStore physicalStore;

  @override
  List<Object> get props => [id, name, category, contact, physicalStore];
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$AcceptingStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query with EquatableMixin {
  AcceptingStoreById$Query();

  factory AcceptingStoreById$Query.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreById$QueryFromJson(json);

  List<AcceptingStoreById$Query$AcceptingStore> acceptingStoreById;

  @override
  List<Object> get props => [acceptingStoreById];
  Map<String, dynamic> toJson() => _$AcceptingStoreById$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class ParamsInput with EquatableMixin {
  ParamsInput({@required this.ids});

  factory ParamsInput.fromJson(Map<String, dynamic> json) =>
      _$ParamsInputFromJson(json);

  List<int> ids;

  @override
  List<Object> get props => [ids];
  Map<String, dynamic> toJson() => _$ParamsInputToJson(this);
}

class AcceptingStoresQuery
    extends GraphQLQuery<AcceptingStores$Query, JsonSerializable> {
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
  AcceptingStores$Query parse(Map<String, dynamic> json) =>
      AcceptingStores$Query.fromJson(json);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreByIdArguments extends JsonSerializable with EquatableMixin {
  AcceptingStoreByIdArguments({@required this.ids});

  @override
  factory AcceptingStoreByIdArguments.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreByIdArgumentsFromJson(json);

  final ParamsInput ids;

  @override
  List<Object> get props => [ids];
  @override
  Map<String, dynamic> toJson() => _$AcceptingStoreByIdArgumentsToJson(this);
}

class AcceptingStoreByIdQuery extends GraphQLQuery<AcceptingStoreById$Query,
    AcceptingStoreByIdArguments> {
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
                    name: NameNode(value: 'physicalStore'),
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
  AcceptingStoreById$Query parse(Map<String, dynamic> json) =>
      AcceptingStoreById$Query.fromJson(json);
}
