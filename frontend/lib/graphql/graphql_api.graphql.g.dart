// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'graphql_api.graphql.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$ContactFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact()
    ..id = json['id'] as int
    ..email = json['email'] as String
    ..telephone = json['telephone'] as String
    ..website = json['website'] as String;
}

Map<String, dynamic>
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$ContactToJson(
            AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact
                instance) =>
        <String, dynamic>{
          'id': instance.id,
          'email': instance.email,
          'telephone': instance.telephone,
          'website': instance.website,
        };

AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$CategoryFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category()
    ..id = json['id'] as int
    ..name = json['name'] as String;
}

Map<String, dynamic>
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$CategoryToJson(
            AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category
                instance) =>
        <String, dynamic>{
          'id': instance.id,
          'name': instance.name,
        };

AcceptingStoreById$Query$PhysicalStore$AcceptingStore
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore$AcceptingStore()
    ..id = json['id'] as int
    ..name = json['name'] as String
    ..description = json['description'] as String
    ..contact = json['contact'] == null
        ? null
        : AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact
            .fromJson(json['contact'] as Map<String, dynamic>)
    ..category = json['category'] == null
        ? null
        : AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category
            .fromJson(json['category'] as Map<String, dynamic>);
}

Map<String, dynamic>
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStoreToJson(
            AcceptingStoreById$Query$PhysicalStore$AcceptingStore instance) =>
        <String, dynamic>{
          'id': instance.id,
          'name': instance.name,
          'description': instance.description,
          'contact': instance.contact?.toJson(),
          'category': instance.category?.toJson(),
        };

AcceptingStoreById$Query$PhysicalStore$Address
    _$AcceptingStoreById$Query$PhysicalStore$AddressFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore$Address()
    ..street = json['street'] as String
    ..postalCode = json['postalCode'] as String
    ..location = json['location'] as String;
}

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStore$AddressToJson(
        AcceptingStoreById$Query$PhysicalStore$Address instance) =>
    <String, dynamic>{
      'street': instance.street,
      'postalCode': instance.postalCode,
      'location': instance.location,
    };

AcceptingStoreById$Query$PhysicalStore
    _$AcceptingStoreById$Query$PhysicalStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore()
    ..store = json['store'] == null
        ? null
        : AcceptingStoreById$Query$PhysicalStore$AcceptingStore.fromJson(
            json['store'] as Map<String, dynamic>)
    ..address = json['address'] == null
        ? null
        : AcceptingStoreById$Query$PhysicalStore$Address.fromJson(
            json['address'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStoreToJson(
        AcceptingStoreById$Query$PhysicalStore instance) =>
    <String, dynamic>{
      'store': instance.store?.toJson(),
      'address': instance.address?.toJson(),
    };

AcceptingStoreById$Query _$AcceptingStoreById$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreById$Query()
    ..physicalStoresById = (json['physicalStoresById'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStoreById$Query$PhysicalStore.fromJson(
                e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStoreById$QueryToJson(
        AcceptingStoreById$Query instance) =>
    <String, dynamic>{
      'physicalStoresById':
          instance.physicalStoresById?.map((e) => e?.toJson())?.toList(),
    };

IdsParamsInput _$IdsParamsInputFromJson(Map<String, dynamic> json) {
  return IdsParamsInput(
    ids: (json['ids'] as List)?.map((e) => e as int)?.toList(),
  );
}

Map<String, dynamic> _$IdsParamsInputToJson(IdsParamsInput instance) =>
    <String, dynamic>{
      'ids': instance.ids,
    };

AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore
    _$AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore()
    ..name = json['name'] as String
    ..description = json['description'] as String;
}

Map<String, dynamic>
    _$AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStoreToJson(
            AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore
                instance) =>
        <String, dynamic>{
          'name': instance.name,
          'description': instance.description,
        };

AcceptingStoreSummaryById$Query$PhysicalStore
    _$AcceptingStoreSummaryById$Query$PhysicalStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query$PhysicalStore()
    ..id = json['id'] as int
    ..store = json['store'] == null
        ? null
        : AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore.fromJson(
            json['store'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStoreSummaryById$Query$PhysicalStoreToJson(
        AcceptingStoreSummaryById$Query$PhysicalStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'store': instance.store?.toJson(),
    };

AcceptingStoreSummaryById$Query _$AcceptingStoreSummaryById$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query()
    ..physicalStoresById = (json['physicalStoresById'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStoreSummaryById$Query$PhysicalStore.fromJson(
                e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStoreSummaryById$QueryToJson(
        AcceptingStoreSummaryById$Query instance) =>
    <String, dynamic>{
      'physicalStoresById':
          instance.physicalStoresById?.map((e) => e?.toJson())?.toList(),
    };

AcceptingStoresSearch$Query$AcceptingStore
    _$AcceptingStoresSearch$Query$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query$AcceptingStore()
    ..id = json['id'] as int
    ..name = json['name'] as String
    ..description = json['description'] as String;
}

Map<String, dynamic> _$AcceptingStoresSearch$Query$AcceptingStoreToJson(
        AcceptingStoresSearch$Query$AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
    };

AcceptingStoresSearch$Query _$AcceptingStoresSearch$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query()
    ..searchAcceptingStores = (json['searchAcceptingStores'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStoresSearch$Query$AcceptingStore.fromJson(
                e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStoresSearch$QueryToJson(
        AcceptingStoresSearch$Query instance) =>
    <String, dynamic>{
      'searchAcceptingStores':
          instance.searchAcceptingStores?.map((e) => e?.toJson())?.toList(),
    };

SearchParamsInput _$SearchParamsInputFromJson(Map<String, dynamic> json) {
  return SearchParamsInput(
    categoryIds: (json['categoryIds'] as List)?.map((e) => e as int)?.toList(),
    searchText: json['searchText'] as String,
  );
}

Map<String, dynamic> _$SearchParamsInputToJson(SearchParamsInput instance) =>
    <String, dynamic>{
      'categoryIds': instance.categoryIds,
      'searchText': instance.searchText,
    };

AcceptingStoreByIdArguments _$AcceptingStoreByIdArgumentsFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreByIdArguments(
    ids: json['ids'] == null
        ? null
        : IdsParamsInput.fromJson(json['ids'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AcceptingStoreByIdArgumentsToJson(
        AcceptingStoreByIdArguments instance) =>
    <String, dynamic>{
      'ids': instance.ids?.toJson(),
    };

AcceptingStoreSummaryByIdArguments _$AcceptingStoreSummaryByIdArgumentsFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreSummaryByIdArguments(
    ids: json['ids'] == null
        ? null
        : IdsParamsInput.fromJson(json['ids'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AcceptingStoreSummaryByIdArgumentsToJson(
        AcceptingStoreSummaryByIdArguments instance) =>
    <String, dynamic>{
      'ids': instance.ids?.toJson(),
    };

AcceptingStoresSearchArguments _$AcceptingStoresSearchArgumentsFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoresSearchArguments(
    params: json['params'] == null
        ? null
        : SearchParamsInput.fromJson(json['params'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AcceptingStoresSearchArgumentsToJson(
        AcceptingStoresSearchArguments instance) =>
    <String, dynamic>{
      'params': instance.params?.toJson(),
    };
