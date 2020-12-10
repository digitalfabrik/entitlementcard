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
    ..houseNumber = json['houseNumber'] as String
    ..postalCode = json['postalCode'] as String
    ..location = json['location'] as String
    ..state = json['state'] as String;
}

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStore$AddressToJson(
        AcceptingStoreById$Query$PhysicalStore$Address instance) =>
    <String, dynamic>{
      'street': instance.street,
      'houseNumber': instance.houseNumber,
      'postalCode': instance.postalCode,
      'location': instance.location,
      'state': instance.state,
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

ParamsInput _$ParamsInputFromJson(Map<String, dynamic> json) {
  return ParamsInput(
    ids: (json['ids'] as List)?.map((e) => e as int)?.toList(),
  );
}

Map<String, dynamic> _$ParamsInputToJson(ParamsInput instance) =>
    <String, dynamic>{
      'ids': instance.ids,
    };

AcceptingStores$Query$AcceptingStoreName$AcceptingStore
    _$AcceptingStores$Query$AcceptingStoreName$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStores$Query$AcceptingStoreName$AcceptingStore()
    ..name = json['name'] as String;
}

Map<String, dynamic>
    _$AcceptingStores$Query$AcceptingStoreName$AcceptingStoreToJson(
            AcceptingStores$Query$AcceptingStoreName$AcceptingStore instance) =>
        <String, dynamic>{
          'name': instance.name,
        };

AcceptingStores$Query$AcceptingStoreName
    _$AcceptingStores$Query$AcceptingStoreNameFromJson(
        Map<String, dynamic> json) {
  return AcceptingStores$Query$AcceptingStoreName()
    ..id = json['id'] as int
    ..store = json['store'] == null
        ? null
        : AcceptingStores$Query$AcceptingStoreName$AcceptingStore.fromJson(
            json['store'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStores$Query$AcceptingStoreNameToJson(
        AcceptingStores$Query$AcceptingStoreName instance) =>
    <String, dynamic>{
      'id': instance.id,
      'store': instance.store?.toJson(),
    };

AcceptingStores$Query _$AcceptingStores$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStores$Query()
    ..acceptingStoreName = (json['acceptingStoreName'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStores$Query$AcceptingStoreName.fromJson(
                e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStores$QueryToJson(
        AcceptingStores$Query instance) =>
    <String, dynamic>{
      'acceptingStoreName':
          instance.acceptingStoreName?.map((e) => e?.toJson())?.toList(),
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

AcceptingStoreByIdArguments _$AcceptingStoreByIdArgumentsFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreByIdArguments(
    ids: json['ids'] == null
        ? null
        : ParamsInput.fromJson(json['ids'] as Map<String, dynamic>),
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
        : ParamsInput.fromJson(json['ids'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AcceptingStoreSummaryByIdArgumentsToJson(
        AcceptingStoreSummaryByIdArguments instance) =>
    <String, dynamic>{
      'ids': instance.ids?.toJson(),
    };
