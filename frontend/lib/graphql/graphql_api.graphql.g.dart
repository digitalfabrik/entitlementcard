// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'graphql_api.graphql.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AcceptingStoreSummaryById$Query$AcceptingStore$Category
    _$AcceptingStoreSummaryById$Query$AcceptingStore$CategoryFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query$AcceptingStore$Category()
    ..name = json['name'] as String;
}

Map<String, dynamic>
    _$AcceptingStoreSummaryById$Query$AcceptingStore$CategoryToJson(
            AcceptingStoreSummaryById$Query$AcceptingStore$Category instance) =>
        <String, dynamic>{
          'name': instance.name,
        };

AcceptingStoreSummaryById$Query$AcceptingStore
    _$AcceptingStoreSummaryById$Query$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query$AcceptingStore()
    ..id = json['id'] as int
    ..name = json['name'] as String
    ..category = json['category'] == null
        ? null
        : AcceptingStoreSummaryById$Query$AcceptingStore$Category.fromJson(
            json['category'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStoreSummaryById$Query$AcceptingStoreToJson(
        AcceptingStoreSummaryById$Query$AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'category': instance.category?.toJson(),
    };

AcceptingStoreSummaryById$Query _$AcceptingStoreSummaryById$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query()
    ..acceptingStoreById = (json['acceptingStoreById'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStoreSummaryById$Query$AcceptingStore.fromJson(
                e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStoreSummaryById$QueryToJson(
        AcceptingStoreSummaryById$Query instance) =>
    <String, dynamic>{
      'acceptingStoreById':
          instance.acceptingStoreById?.map((e) => e?.toJson())?.toList(),
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

AcceptingStoreById$Query$AcceptingStore$Category
    _$AcceptingStoreById$Query$AcceptingStore$CategoryFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$AcceptingStore$Category()
    ..name = json['name'] as String;
}

Map<String, dynamic> _$AcceptingStoreById$Query$AcceptingStore$CategoryToJson(
        AcceptingStoreById$Query$AcceptingStore$Category instance) =>
    <String, dynamic>{
      'name': instance.name,
    };

AcceptingStoreById$Query$AcceptingStore$Contact
    _$AcceptingStoreById$Query$AcceptingStore$ContactFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$AcceptingStore$Contact()
    ..email = json['email'] as String
    ..telephone = json['telephone'] as String
    ..website = json['website'] as String;
}

Map<String, dynamic> _$AcceptingStoreById$Query$AcceptingStore$ContactToJson(
        AcceptingStoreById$Query$AcceptingStore$Contact instance) =>
    <String, dynamic>{
      'email': instance.email,
      'telephone': instance.telephone,
      'website': instance.website,
    };

AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$Coordinates
    _$AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$CoordinatesFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$Coordinates()
    ..latitude = (json['latitude'] as num)?.toDouble()
    ..longitude = (json['longitude'] as num)?.toDouble();
}

Map<String, dynamic>
    _$AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$CoordinatesToJson(
            AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$Coordinates
                instance) =>
        <String, dynamic>{
          'latitude': instance.latitude,
          'longitude': instance.longitude,
        };

AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address
    _$AcceptingStoreById$Query$AcceptingStore$PhysicalStore$AddressFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address()
    ..coordinates = json['coordinates'] == null
        ? null
        : AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address$Coordinates
            .fromJson(json['coordinates'] as Map<String, dynamic>)
    ..houseNumber = json['houseNumber'] as String
    ..street = json['street'] as String
    ..postalCode = json['postalCode'] as String
    ..location = json['location'] as String
    ..state = json['state'] as String;
}

Map<String, dynamic>
    _$AcceptingStoreById$Query$AcceptingStore$PhysicalStore$AddressToJson(
            AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address
                instance) =>
        <String, dynamic>{
          'coordinates': instance.coordinates?.toJson(),
          'houseNumber': instance.houseNumber,
          'street': instance.street,
          'postalCode': instance.postalCode,
          'location': instance.location,
          'state': instance.state,
        };

AcceptingStoreById$Query$AcceptingStore$PhysicalStore
    _$AcceptingStoreById$Query$AcceptingStore$PhysicalStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$AcceptingStore$PhysicalStore()
    ..address = json['address'] == null
        ? null
        : AcceptingStoreById$Query$AcceptingStore$PhysicalStore$Address
            .fromJson(json['address'] as Map<String, dynamic>);
}

Map<String, dynamic>
    _$AcceptingStoreById$Query$AcceptingStore$PhysicalStoreToJson(
            AcceptingStoreById$Query$AcceptingStore$PhysicalStore instance) =>
        <String, dynamic>{
          'address': instance.address?.toJson(),
        };

AcceptingStoreById$Query$AcceptingStore
    _$AcceptingStoreById$Query$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$AcceptingStore()
    ..id = json['id'] as int
    ..name = json['name'] as String
    ..category = json['category'] == null
        ? null
        : AcceptingStoreById$Query$AcceptingStore$Category.fromJson(
            json['category'] as Map<String, dynamic>)
    ..contact = json['contact'] == null
        ? null
        : AcceptingStoreById$Query$AcceptingStore$Contact.fromJson(
            json['contact'] as Map<String, dynamic>)
    ..physicalStore = json['physicalStore'] == null
        ? null
        : AcceptingStoreById$Query$AcceptingStore$PhysicalStore.fromJson(
            json['physicalStore'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStoreById$Query$AcceptingStoreToJson(
        AcceptingStoreById$Query$AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'category': instance.category?.toJson(),
      'contact': instance.contact?.toJson(),
      'physicalStore': instance.physicalStore?.toJson(),
    };

AcceptingStoreById$Query _$AcceptingStoreById$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreById$Query()
    ..acceptingStoreById = (json['acceptingStoreById'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStoreById$Query$AcceptingStore.fromJson(
                e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStoreById$QueryToJson(
        AcceptingStoreById$Query instance) =>
    <String, dynamic>{
      'acceptingStoreById':
          instance.acceptingStoreById?.map((e) => e?.toJson())?.toList(),
    };

AcceptingStores$Query$AcceptingStoreName
    _$AcceptingStores$Query$AcceptingStoreNameFromJson(
        Map<String, dynamic> json) {
  return AcceptingStores$Query$AcceptingStoreName()
    ..id = json['id'] as int
    ..name = json['name'] as String;
}

Map<String, dynamic> _$AcceptingStores$Query$AcceptingStoreNameToJson(
        AcceptingStores$Query$AcceptingStoreName instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
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
