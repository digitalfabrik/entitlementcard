// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'graphql_api.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AcceptingStores _$AcceptingStoresFromJson(Map<String, dynamic> json) {
  return AcceptingStores()
    ..acceptingStoreName = (json['acceptingStoreName'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStoreName.fromJson(e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStoresToJson(AcceptingStores instance) =>
    <String, dynamic>{
      'acceptingStoreName':
          instance.acceptingStoreName?.map((e) => e?.toJson())?.toList(),
    };

AcceptingStoreName _$AcceptingStoreNameFromJson(Map<String, dynamic> json) {
  return AcceptingStoreName()
    ..id = json['id'] as int
    ..name = json['name'] as String;
}

Map<String, dynamic> _$AcceptingStoreNameToJson(AcceptingStoreName instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
    };

AcceptingStoreById _$AcceptingStoreByIdFromJson(Map<String, dynamic> json) {
  return AcceptingStoreById()
    ..acceptingStoreById = (json['acceptingStoreById'] as List)
        ?.map((e) => e == null
            ? null
            : AcceptingStore.fromJson(e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$AcceptingStoreByIdToJson(AcceptingStoreById instance) =>
    <String, dynamic>{
      'acceptingStoreById':
          instance.acceptingStoreById?.map((e) => e?.toJson())?.toList(),
    };

AcceptingStore _$AcceptingStoreFromJson(Map<String, dynamic> json) {
  return AcceptingStore()
    ..id = json['id'] as int
    ..name = json['name'] as String
    ..category = json['category'] == null
        ? null
        : Category.fromJson(json['category'] as Map<String, dynamic>)
    ..contact = json['contact'] == null
        ? null
        : Contact.fromJson(json['contact'] as Map<String, dynamic>)
    ..phyiscalStore = json['phyiscalStore'] == null
        ? null
        : PhysicalStore.fromJson(json['phyiscalStore'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStoreToJson(AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'category': instance.category?.toJson(),
      'contact': instance.contact?.toJson(),
      'phyiscalStore': instance.phyiscalStore?.toJson(),
    };

Category _$CategoryFromJson(Map<String, dynamic> json) {
  return Category()..name = json['name'] as String;
}

Map<String, dynamic> _$CategoryToJson(Category instance) => <String, dynamic>{
      'name': instance.name,
    };

Contact _$ContactFromJson(Map<String, dynamic> json) {
  return Contact()
    ..email = json['email'] as String
    ..telephone = json['telephone'] as String
    ..website = json['website'] as String;
}

Map<String, dynamic> _$ContactToJson(Contact instance) => <String, dynamic>{
      'email': instance.email,
      'telephone': instance.telephone,
      'website': instance.website,
    };

PhysicalStore _$PhysicalStoreFromJson(Map<String, dynamic> json) {
  return PhysicalStore()
    ..address = json['address'] == null
        ? null
        : Address.fromJson(json['address'] as Map<String, dynamic>);
}

Map<String, dynamic> _$PhysicalStoreToJson(PhysicalStore instance) =>
    <String, dynamic>{
      'address': instance.address?.toJson(),
    };

Address _$AddressFromJson(Map<String, dynamic> json) {
  return Address()
    ..coordinates = json['coordinates'] == null
        ? null
        : Coordinates.fromJson(json['coordinates'] as Map<String, dynamic>)
    ..houseNumber = json['houseNumber'] as String
    ..street = json['street'] as String
    ..postalCode = json['postalCode'] as String
    ..location = json['location'] as String
    ..state = json['state'] as String;
}

Map<String, dynamic> _$AddressToJson(Address instance) => <String, dynamic>{
      'coordinates': instance.coordinates?.toJson(),
      'houseNumber': instance.houseNumber,
      'street': instance.street,
      'postalCode': instance.postalCode,
      'location': instance.location,
      'state': instance.state,
    };

Coordinates _$CoordinatesFromJson(Map<String, dynamic> json) {
  return Coordinates()
    ..latitude = (json['latitude'] as num)?.toDouble()
    ..longitude = (json['longitude'] as num)?.toDouble();
}

Map<String, dynamic> _$CoordinatesToJson(Coordinates instance) =>
    <String, dynamic>{
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };

ParamsInput _$ParamsInputFromJson(Map<String, dynamic> json) {
  dynamic list = json['ids'] as List;
  print(list);
  dynamic map = list.map((e) => e as int)?.toList();
  print(map);
  return ParamsInput()
    ..ids = (json['ids'] as List)?.map((e) => e as int)?.toList();
}

Map<String, dynamic> _$ParamsInputToJson(ParamsInput instance) =>
    <String, dynamic>{
      'ids': instance.ids,
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
