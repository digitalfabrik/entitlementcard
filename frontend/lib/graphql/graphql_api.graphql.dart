// GENERATED CODE - DO NOT MODIFY BY HAND
// @dart = 2.12

import 'package:artemis/artemis.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:equatable/equatable.dart';
import 'package:gql/ast.dart';
import 'package:http/http.dart';
import 'upload_parser.dart';
part 'graphql_api.graphql.g.dart';

@JsonSerializable(explicitToJson: true)
class GetRegionsById$Query$Region extends JsonSerializable with EquatableMixin {
  GetRegionsById$Query$Region();

  factory GetRegionsById$Query$Region.fromJson(Map<String, dynamic> json) =>
      _$GetRegionsById$Query$RegionFromJson(json);

  late int id;

  late String prefix;

  late String name;

  @override
  List<Object?> get props => [id, prefix, name];
  @override
  Map<String, dynamic> toJson() => _$GetRegionsById$Query$RegionToJson(this);
}

@JsonSerializable(explicitToJson: true)
class GetRegionsById$Query extends JsonSerializable with EquatableMixin {
  GetRegionsById$Query();

  factory GetRegionsById$Query.fromJson(Map<String, dynamic> json) =>
      _$GetRegionsById$QueryFromJson(json);

  @Deprecated(
      'Deprecated in favor of project specific query, replace with regionsByIdInProject')
  late List<GetRegionsById$Query$Region?> regionsById;

  @override
  List<Object?> get props => [regionsById];
  @override
  Map<String, dynamic> toJson() => _$GetRegionsById$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class GetRegions$Query$Region extends JsonSerializable with EquatableMixin {
  GetRegions$Query$Region();

  factory GetRegions$Query$Region.fromJson(Map<String, dynamic> json) =>
      _$GetRegions$Query$RegionFromJson(json);

  late int id;

  late String prefix;

  late String name;

  @override
  List<Object?> get props => [id, prefix, name];
  @override
  Map<String, dynamic> toJson() => _$GetRegions$Query$RegionToJson(this);
}

@JsonSerializable(explicitToJson: true)
class GetRegions$Query extends JsonSerializable with EquatableMixin {
  GetRegions$Query();

  factory GetRegions$Query.fromJson(Map<String, dynamic> json) =>
      _$GetRegions$QueryFromJson(json);

  @Deprecated(
      'Deprecated in favor of project specific query, replace with regionsInProject')
  late List<GetRegions$Query$Region> regions;

  @override
  List<Object?> get props => [regions];
  @override
  Map<String, dynamic> toJson() => _$GetRegions$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address
    extends JsonSerializable with EquatableMixin {
  AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address();

  factory AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$AddressFromJson(
          json);

  String? location;

  @override
  List<Object?> get props => [location];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$AddressToJson(
          this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates
    extends JsonSerializable with EquatableMixin {
  AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates();

  factory AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$CoordinatesFromJson(
          json);

  late double lat;

  late double lng;

  @override
  List<Object?> get props => [lat, lng];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$CoordinatesToJson(
          this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore
    extends JsonSerializable with EquatableMixin {
  AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore();

  factory AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStoreFromJson(json);

  late AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address address;

  late AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates
      coordinates;

  @override
  List<Object?> get props => [address, coordinates];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoresSearch$Query$AcceptingStore extends JsonSerializable
    with EquatableMixin {
  AcceptingStoresSearch$Query$AcceptingStore();

  factory AcceptingStoresSearch$Query$AcceptingStore.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoresSearch$Query$AcceptingStoreFromJson(json);

  late int id;

  String? name;

  String? description;

  AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore? physicalStore;

  late int categoryId;

  @override
  List<Object?> get props => [id, name, description, physicalStore, categoryId];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoresSearch$Query$AcceptingStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoresSearch$Query extends JsonSerializable with EquatableMixin {
  AcceptingStoresSearch$Query();

  factory AcceptingStoresSearch$Query.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoresSearch$QueryFromJson(json);

  @Deprecated(
      'Deprecated in favor of project specific query, replace with searchAcceptingStoresInProject')
  late List<AcceptingStoresSearch$Query$AcceptingStore> searchAcceptingStores;

  @override
  List<Object?> get props => [searchAcceptingStores];
  @override
  Map<String, dynamic> toJson() => _$AcceptingStoresSearch$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class SearchParamsInput extends JsonSerializable with EquatableMixin {
  SearchParamsInput(
      {this.categoryIds,
      this.coordinates,
      this.limit,
      this.offset,
      this.searchText});

  factory SearchParamsInput.fromJson(Map<String, dynamic> json) =>
      _$SearchParamsInputFromJson(json);

  List<int>? categoryIds;

  CoordinatesInput? coordinates;

  int? limit;

  int? offset;

  String? searchText;

  @override
  List<Object?> get props =>
      [categoryIds, coordinates, limit, offset, searchText];
  @override
  Map<String, dynamic> toJson() => _$SearchParamsInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class CoordinatesInput extends JsonSerializable with EquatableMixin {
  CoordinatesInput({required this.lat, required this.lng});

  factory CoordinatesInput.fromJson(Map<String, dynamic> json) =>
      _$CoordinatesInputFromJson(json);

  late double lat;

  late double lng;

  @override
  List<Object?> get props => [lat, lng];
  @override
  Map<String, dynamic> toJson() => _$CoordinatesInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$PhysicalStore$Coordinates
    extends JsonSerializable with EquatableMixin {
  AcceptingStoreById$Query$PhysicalStore$Coordinates();

  factory AcceptingStoreById$Query$PhysicalStore$Coordinates.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$PhysicalStore$CoordinatesFromJson(json);

  late double lat;

  late double lng;

  @override
  List<Object?> get props => [lat, lng];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$PhysicalStore$CoordinatesToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact
    extends JsonSerializable with EquatableMixin {
  AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact();

  factory AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$ContactFromJson(
          json);

  late int id;

  String? email;

  String? telephone;

  String? website;

  @override
  List<Object?> get props => [id, email, telephone, website];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$ContactToJson(
          this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category
    extends JsonSerializable with EquatableMixin {
  AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category();

  factory AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$CategoryFromJson(
          json);

  late int id;

  late String name;

  @override
  List<Object?> get props => [id, name];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$CategoryToJson(
          this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$PhysicalStore$AcceptingStore
    extends JsonSerializable with EquatableMixin {
  AcceptingStoreById$Query$PhysicalStore$AcceptingStore();

  factory AcceptingStoreById$Query$PhysicalStore$AcceptingStore.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$PhysicalStore$AcceptingStoreFromJson(json);

  late int id;

  String? name;

  String? description;

  late AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact contact;

  late AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category category;

  @override
  List<Object?> get props => [id, name, description, contact, category];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$PhysicalStore$AcceptingStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$PhysicalStore$Address extends JsonSerializable
    with EquatableMixin {
  AcceptingStoreById$Query$PhysicalStore$Address();

  factory AcceptingStoreById$Query$PhysicalStore$Address.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$PhysicalStore$AddressFromJson(json);

  String? street;

  String? postalCode;

  String? location;

  @override
  List<Object?> get props => [street, postalCode, location];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$PhysicalStore$AddressToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query$PhysicalStore extends JsonSerializable
    with EquatableMixin {
  AcceptingStoreById$Query$PhysicalStore();

  factory AcceptingStoreById$Query$PhysicalStore.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreById$Query$PhysicalStoreFromJson(json);

  late int id;

  late AcceptingStoreById$Query$PhysicalStore$Coordinates coordinates;

  late AcceptingStoreById$Query$PhysicalStore$AcceptingStore store;

  late AcceptingStoreById$Query$PhysicalStore$Address address;

  @override
  List<Object?> get props => [id, coordinates, store, address];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreById$Query$PhysicalStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreById$Query extends JsonSerializable with EquatableMixin {
  AcceptingStoreById$Query();

  factory AcceptingStoreById$Query.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreById$QueryFromJson(json);

  @Deprecated(
      'Deprecated in favor of project specific query, replace with physicalStoresByIdInProject')
  late List<AcceptingStoreById$Query$PhysicalStore?> physicalStoresById;

  @override
  List<Object?> get props => [physicalStoresById];
  @override
  Map<String, dynamic> toJson() => _$AcceptingStoreById$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore
    extends JsonSerializable with EquatableMixin {
  AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore();

  factory AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStoreFromJson(
          json);

  String? name;

  String? description;

  late int categoryId;

  @override
  List<Object?> get props => [name, description, categoryId];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStoreToJson(
          this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreSummaryById$Query$PhysicalStore extends JsonSerializable
    with EquatableMixin {
  AcceptingStoreSummaryById$Query$PhysicalStore();

  factory AcceptingStoreSummaryById$Query$PhysicalStore.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreSummaryById$Query$PhysicalStoreFromJson(json);

  late int id;

  late AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore store;

  @override
  List<Object?> get props => [id, store];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreSummaryById$Query$PhysicalStoreToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreSummaryById$Query extends JsonSerializable
    with EquatableMixin {
  AcceptingStoreSummaryById$Query();

  factory AcceptingStoreSummaryById$Query.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreSummaryById$QueryFromJson(json);

  @Deprecated(
      'Deprecated in favor of project specific query, replace with physicalStoresByIdInProject')
  late List<AcceptingStoreSummaryById$Query$PhysicalStore?> physicalStoresById;

  @override
  List<Object?> get props => [physicalStoresById];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreSummaryById$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class CardVerificationByHash$Query extends JsonSerializable
    with EquatableMixin {
  CardVerificationByHash$Query();

  factory CardVerificationByHash$Query.fromJson(Map<String, dynamic> json) =>
      _$CardVerificationByHash$QueryFromJson(json);

  @Deprecated(
      'Deprecated in favor of project specific query, replace with verifyCardInProject')
  late bool cardValid;

  @override
  List<Object?> get props => [cardValid];
  @override
  Map<String, dynamic> toJson() => _$CardVerificationByHash$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class CardVerificationModelInput extends JsonSerializable with EquatableMixin {
  CardVerificationModelInput(
      {required this.cardDetailsHashBase64, required this.totp});

  factory CardVerificationModelInput.fromJson(Map<String, dynamic> json) =>
      _$CardVerificationModelInputFromJson(json);

  late String cardDetailsHashBase64;

  late int totp;

  @override
  List<Object?> get props => [cardDetailsHashBase64, totp];
  @override
  Map<String, dynamic> toJson() => _$CardVerificationModelInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class GetRegionsByIdArguments extends JsonSerializable with EquatableMixin {
  GetRegionsByIdArguments({required this.ids});

  @override
  factory GetRegionsByIdArguments.fromJson(Map<String, dynamic> json) =>
      _$GetRegionsByIdArgumentsFromJson(json);

  late List<int> ids;

  @override
  List<Object?> get props => [ids];
  @override
  Map<String, dynamic> toJson() => _$GetRegionsByIdArgumentsToJson(this);
}

final GET_REGIONS_BY_ID_QUERY_DOCUMENT_OPERATION_NAME = 'getRegionsById';
final GET_REGIONS_BY_ID_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'getRegionsById'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'ids')),
            type: ListTypeNode(
                type: NamedTypeNode(
                    name: NameNode(value: 'Int'), isNonNull: true),
                isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: [])
      ],
      directives: [],
      selectionSet: SelectionSetNode(selections: [
        FieldNode(
            name: NameNode(value: 'regionsById'),
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
                  name: NameNode(value: 'prefix'),
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

class GetRegionsByIdQuery
    extends GraphQLQuery<GetRegionsById$Query, GetRegionsByIdArguments> {
  GetRegionsByIdQuery({required this.variables});

  @override
  final DocumentNode document = GET_REGIONS_BY_ID_QUERY_DOCUMENT;

  @override
  final String operationName = GET_REGIONS_BY_ID_QUERY_DOCUMENT_OPERATION_NAME;

  @override
  final GetRegionsByIdArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  GetRegionsById$Query parse(Map<String, dynamic> json) =>
      GetRegionsById$Query.fromJson(json);
}

final GET_REGIONS_QUERY_DOCUMENT_OPERATION_NAME = 'getRegions';
final GET_REGIONS_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'getRegions'),
      variableDefinitions: [],
      directives: [],
      selectionSet: SelectionSetNode(selections: [
        FieldNode(
            name: NameNode(value: 'regions'),
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
                  name: NameNode(value: 'prefix'),
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

class GetRegionsQuery extends GraphQLQuery<GetRegions$Query, JsonSerializable> {
  GetRegionsQuery();

  @override
  final DocumentNode document = GET_REGIONS_QUERY_DOCUMENT;

  @override
  final String operationName = GET_REGIONS_QUERY_DOCUMENT_OPERATION_NAME;

  @override
  List<Object?> get props => [document, operationName];
  @override
  GetRegions$Query parse(Map<String, dynamic> json) =>
      GetRegions$Query.fromJson(json);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoresSearchArguments extends JsonSerializable
    with EquatableMixin {
  AcceptingStoresSearchArguments({required this.params});

  @override
  factory AcceptingStoresSearchArguments.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoresSearchArgumentsFromJson(json);

  late SearchParamsInput params;

  @override
  List<Object?> get props => [params];
  @override
  Map<String, dynamic> toJson() => _$AcceptingStoresSearchArgumentsToJson(this);
}

final ACCEPTING_STORES_SEARCH_QUERY_DOCUMENT_OPERATION_NAME =
    'AcceptingStoresSearch';
final ACCEPTING_STORES_SEARCH_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'AcceptingStoresSearch'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'params')),
            type: NamedTypeNode(
                name: NameNode(value: 'SearchParamsInput'), isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: [])
      ],
      directives: [],
      selectionSet: SelectionSetNode(selections: [
        FieldNode(
            name: NameNode(value: 'searchAcceptingStores'),
            alias: null,
            arguments: [
              ArgumentNode(
                  name: NameNode(value: 'params'),
                  value: VariableNode(name: NameNode(value: 'params')))
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
                  name: NameNode(value: 'description'),
                  alias: null,
                  arguments: [],
                  directives: [],
                  selectionSet: null),
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
                              name: NameNode(value: 'location'),
                              alias: null,
                              arguments: [],
                              directives: [],
                              selectionSet: null)
                        ])),
                    FieldNode(
                        name: NameNode(value: 'coordinates'),
                        alias: null,
                        arguments: [],
                        directives: [],
                        selectionSet: SelectionSetNode(selections: [
                          FieldNode(
                              name: NameNode(value: 'lat'),
                              alias: null,
                              arguments: [],
                              directives: [],
                              selectionSet: null),
                          FieldNode(
                              name: NameNode(value: 'lng'),
                              alias: null,
                              arguments: [],
                              directives: [],
                              selectionSet: null)
                        ]))
                  ])),
              FieldNode(
                  name: NameNode(value: 'categoryId'),
                  alias: null,
                  arguments: [],
                  directives: [],
                  selectionSet: null)
            ]))
      ]))
]);

class AcceptingStoresSearchQuery extends GraphQLQuery<
    AcceptingStoresSearch$Query, AcceptingStoresSearchArguments> {
  AcceptingStoresSearchQuery({required this.variables});

  @override
  final DocumentNode document = ACCEPTING_STORES_SEARCH_QUERY_DOCUMENT;

  @override
  final String operationName =
      ACCEPTING_STORES_SEARCH_QUERY_DOCUMENT_OPERATION_NAME;

  @override
  final AcceptingStoresSearchArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  AcceptingStoresSearch$Query parse(Map<String, dynamic> json) =>
      AcceptingStoresSearch$Query.fromJson(json);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreByIdArguments extends JsonSerializable with EquatableMixin {
  AcceptingStoreByIdArguments({required this.ids});

  @override
  factory AcceptingStoreByIdArguments.fromJson(Map<String, dynamic> json) =>
      _$AcceptingStoreByIdArgumentsFromJson(json);

  late List<int> ids;

  @override
  List<Object?> get props => [ids];
  @override
  Map<String, dynamic> toJson() => _$AcceptingStoreByIdArgumentsToJson(this);
}

final ACCEPTING_STORE_BY_ID_QUERY_DOCUMENT_OPERATION_NAME =
    'AcceptingStoreById';
final ACCEPTING_STORE_BY_ID_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'AcceptingStoreById'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'ids')),
            type: ListTypeNode(
                type: NamedTypeNode(
                    name: NameNode(value: 'Int'), isNonNull: true),
                isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: [])
      ],
      directives: [],
      selectionSet: SelectionSetNode(selections: [
        FieldNode(
            name: NameNode(value: 'physicalStoresById'),
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
                  name: NameNode(value: 'coordinates'),
                  alias: null,
                  arguments: [],
                  directives: [],
                  selectionSet: SelectionSetNode(selections: [
                    FieldNode(
                        name: NameNode(value: 'lat'),
                        alias: null,
                        arguments: [],
                        directives: [],
                        selectionSet: null),
                    FieldNode(
                        name: NameNode(value: 'lng'),
                        alias: null,
                        arguments: [],
                        directives: [],
                        selectionSet: null)
                  ])),
              FieldNode(
                  name: NameNode(value: 'store'),
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
                        selectionSet: null),
                    FieldNode(
                        name: NameNode(value: 'description'),
                        alias: null,
                        arguments: [],
                        directives: [],
                        selectionSet: null),
                    FieldNode(
                        name: NameNode(value: 'contact'),
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
                        ]))
                  ])),
              FieldNode(
                  name: NameNode(value: 'address'),
                  alias: null,
                  arguments: [],
                  directives: [],
                  selectionSet: SelectionSetNode(selections: [
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
                        selectionSet: null)
                  ]))
            ]))
      ]))
]);

class AcceptingStoreByIdQuery extends GraphQLQuery<AcceptingStoreById$Query,
    AcceptingStoreByIdArguments> {
  AcceptingStoreByIdQuery({required this.variables});

  @override
  final DocumentNode document = ACCEPTING_STORE_BY_ID_QUERY_DOCUMENT;

  @override
  final String operationName =
      ACCEPTING_STORE_BY_ID_QUERY_DOCUMENT_OPERATION_NAME;

  @override
  final AcceptingStoreByIdArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  AcceptingStoreById$Query parse(Map<String, dynamic> json) =>
      AcceptingStoreById$Query.fromJson(json);
}

@JsonSerializable(explicitToJson: true)
class AcceptingStoreSummaryByIdArguments extends JsonSerializable
    with EquatableMixin {
  AcceptingStoreSummaryByIdArguments({required this.ids});

  @override
  factory AcceptingStoreSummaryByIdArguments.fromJson(
          Map<String, dynamic> json) =>
      _$AcceptingStoreSummaryByIdArgumentsFromJson(json);

  late List<int> ids;

  @override
  List<Object?> get props => [ids];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreSummaryByIdArgumentsToJson(this);
}

final ACCEPTING_STORE_SUMMARY_BY_ID_QUERY_DOCUMENT_OPERATION_NAME =
    'AcceptingStoreSummaryById';
final ACCEPTING_STORE_SUMMARY_BY_ID_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'AcceptingStoreSummaryById'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'ids')),
            type: ListTypeNode(
                type: NamedTypeNode(
                    name: NameNode(value: 'Int'), isNonNull: true),
                isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: [])
      ],
      directives: [],
      selectionSet: SelectionSetNode(selections: [
        FieldNode(
            name: NameNode(value: 'physicalStoresById'),
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
                  name: NameNode(value: 'store'),
                  alias: null,
                  arguments: [],
                  directives: [],
                  selectionSet: SelectionSetNode(selections: [
                    FieldNode(
                        name: NameNode(value: 'name'),
                        alias: null,
                        arguments: [],
                        directives: [],
                        selectionSet: null),
                    FieldNode(
                        name: NameNode(value: 'description'),
                        alias: null,
                        arguments: [],
                        directives: [],
                        selectionSet: null),
                    FieldNode(
                        name: NameNode(value: 'categoryId'),
                        alias: null,
                        arguments: [],
                        directives: [],
                        selectionSet: null)
                  ]))
            ]))
      ]))
]);

class AcceptingStoreSummaryByIdQuery extends GraphQLQuery<
    AcceptingStoreSummaryById$Query, AcceptingStoreSummaryByIdArguments> {
  AcceptingStoreSummaryByIdQuery({required this.variables});

  @override
  final DocumentNode document = ACCEPTING_STORE_SUMMARY_BY_ID_QUERY_DOCUMENT;

  @override
  final String operationName =
      ACCEPTING_STORE_SUMMARY_BY_ID_QUERY_DOCUMENT_OPERATION_NAME;

  @override
  final AcceptingStoreSummaryByIdArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  AcceptingStoreSummaryById$Query parse(Map<String, dynamic> json) =>
      AcceptingStoreSummaryById$Query.fromJson(json);
}

@JsonSerializable(explicitToJson: true)
class CardVerificationByHashArguments extends JsonSerializable
    with EquatableMixin {
  CardVerificationByHashArguments({required this.card});

  @override
  factory CardVerificationByHashArguments.fromJson(Map<String, dynamic> json) =>
      _$CardVerificationByHashArgumentsFromJson(json);

  late CardVerificationModelInput card;

  @override
  List<Object?> get props => [card];
  @override
  Map<String, dynamic> toJson() =>
      _$CardVerificationByHashArgumentsToJson(this);
}

final CARD_VERIFICATION_BY_HASH_QUERY_DOCUMENT_OPERATION_NAME =
    'CardVerificationByHash';
final CARD_VERIFICATION_BY_HASH_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'CardVerificationByHash'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'card')),
            type: NamedTypeNode(
                name: NameNode(value: 'CardVerificationModelInput'),
                isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: [])
      ],
      directives: [],
      selectionSet: SelectionSetNode(selections: [
        FieldNode(
            name: NameNode(value: 'verifyCard'),
            alias: NameNode(value: 'cardValid'),
            arguments: [
              ArgumentNode(
                  name: NameNode(value: 'card'),
                  value: VariableNode(name: NameNode(value: 'card')))
            ],
            directives: [],
            selectionSet: null)
      ]))
]);

class CardVerificationByHashQuery extends GraphQLQuery<
    CardVerificationByHash$Query, CardVerificationByHashArguments> {
  CardVerificationByHashQuery({required this.variables});

  @override
  final DocumentNode document = CARD_VERIFICATION_BY_HASH_QUERY_DOCUMENT;

  @override
  final String operationName =
      CARD_VERIFICATION_BY_HASH_QUERY_DOCUMENT_OPERATION_NAME;

  @override
  final CardVerificationByHashArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  CardVerificationByHash$Query parse(Map<String, dynamic> json) =>
      CardVerificationByHash$Query.fromJson(json);
}
