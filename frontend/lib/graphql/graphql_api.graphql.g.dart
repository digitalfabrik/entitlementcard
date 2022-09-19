// GENERATED CODE - DO NOT MODIFY BY HAND
// @dart=2.12

part of 'graphql_api.graphql.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CardVerificationByHash$Query _$CardVerificationByHash$QueryFromJson(Map<String, dynamic> json) =>
    CardVerificationByHash$Query()..cardValid = json['cardValid'] as bool;

Map<String, dynamic> _$CardVerificationByHash$QueryToJson(CardVerificationByHash$Query instance) => <String, dynamic>{
      'cardValid': instance.cardValid,
    };

CardVerificationModelInput _$CardVerificationModelInputFromJson(Map<String, dynamic> json) =>
    CardVerificationModelInput(
      cardDetailsHashBase64: json['cardDetailsHashBase64'] as String,
      totp: json['totp'] as int,
    );

Map<String, dynamic> _$CardVerificationModelInputToJson(CardVerificationModelInput instance) => <String, dynamic>{
      'cardDetailsHashBase64': instance.cardDetailsHashBase64,
      'totp': instance.totp,
    };

AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore
    _$AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStoreFromJson(Map<String, dynamic> json) =>
        AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore()
          ..name = json['name'] as String?
          ..description = json['description'] as String?
          ..categoryId = json['categoryId'] as int;

Map<String, dynamic> _$AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStoreToJson(
        AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore instance) =>
    <String, dynamic>{
      'name': instance.name,
      'description': instance.description,
      'categoryId': instance.categoryId,
    };

AcceptingStoreSummaryById$Query$PhysicalStore _$AcceptingStoreSummaryById$Query$PhysicalStoreFromJson(
        Map<String, dynamic> json) =>
    AcceptingStoreSummaryById$Query$PhysicalStore()
      ..id = json['id'] as int
      ..store =
          AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore.fromJson(json['store'] as Map<String, dynamic>);

Map<String, dynamic> _$AcceptingStoreSummaryById$Query$PhysicalStoreToJson(
        AcceptingStoreSummaryById$Query$PhysicalStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'store': instance.store.toJson(),
    };

AcceptingStoreSummaryById$Query _$AcceptingStoreSummaryById$QueryFromJson(Map<String, dynamic> json) =>
    AcceptingStoreSummaryById$Query()
      ..physicalStoresByIdInProject = (json['physicalStoresByIdInProject'] as List<dynamic>)
          .map((e) =>
              e == null ? null : AcceptingStoreSummaryById$Query$PhysicalStore.fromJson(e as Map<String, dynamic>))
          .toList();

Map<String, dynamic> _$AcceptingStoreSummaryById$QueryToJson(AcceptingStoreSummaryById$Query instance) =>
    <String, dynamic>{
      'physicalStoresByIdInProject': instance.physicalStoresByIdInProject.map((e) => e?.toJson()).toList(),
    };

AcceptingStoreById$Query$PhysicalStore$Coordinates _$AcceptingStoreById$Query$PhysicalStore$CoordinatesFromJson(
        Map<String, dynamic> json) =>
    AcceptingStoreById$Query$PhysicalStore$Coordinates()
      ..lat = (json['lat'] as num).toDouble()
      ..lng = (json['lng'] as num).toDouble();

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStore$CoordinatesToJson(
        AcceptingStoreById$Query$PhysicalStore$Coordinates instance) =>
    <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
    };

AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$ContactFromJson(Map<String, dynamic> json) =>
        AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact()
          ..id = json['id'] as int
          ..email = json['email'] as String?
          ..telephone = json['telephone'] as String?
          ..website = json['website'] as String?;

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$ContactToJson(
        AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'telephone': instance.telephone,
      'website': instance.website,
    };

AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$CategoryFromJson(Map<String, dynamic> json) =>
        AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category()
          ..id = json['id'] as int
          ..name = json['name'] as String;

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$CategoryToJson(
        AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
    };

AcceptingStoreById$Query$PhysicalStore$AcceptingStore _$AcceptingStoreById$Query$PhysicalStore$AcceptingStoreFromJson(
        Map<String, dynamic> json) =>
    AcceptingStoreById$Query$PhysicalStore$AcceptingStore()
      ..id = json['id'] as int
      ..name = json['name'] as String?
      ..description = json['description'] as String?
      ..contact = AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact.fromJson(
          json['contact'] as Map<String, dynamic>)
      ..category = AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category.fromJson(
          json['category'] as Map<String, dynamic>);

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStore$AcceptingStoreToJson(
        AcceptingStoreById$Query$PhysicalStore$AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'contact': instance.contact.toJson(),
      'category': instance.category.toJson(),
    };

AcceptingStoreById$Query$PhysicalStore$Address _$AcceptingStoreById$Query$PhysicalStore$AddressFromJson(
        Map<String, dynamic> json) =>
    AcceptingStoreById$Query$PhysicalStore$Address()
      ..street = json['street'] as String?
      ..postalCode = json['postalCode'] as String?
      ..location = json['location'] as String?;

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStore$AddressToJson(
        AcceptingStoreById$Query$PhysicalStore$Address instance) =>
    <String, dynamic>{
      'street': instance.street,
      'postalCode': instance.postalCode,
      'location': instance.location,
    };

AcceptingStoreById$Query$PhysicalStore _$AcceptingStoreById$Query$PhysicalStoreFromJson(Map<String, dynamic> json) =>
    AcceptingStoreById$Query$PhysicalStore()
      ..id = json['id'] as int
      ..coordinates =
          AcceptingStoreById$Query$PhysicalStore$Coordinates.fromJson(json['coordinates'] as Map<String, dynamic>)
      ..store = AcceptingStoreById$Query$PhysicalStore$AcceptingStore.fromJson(json['store'] as Map<String, dynamic>)
      ..address = AcceptingStoreById$Query$PhysicalStore$Address.fromJson(json['address'] as Map<String, dynamic>);

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStoreToJson(AcceptingStoreById$Query$PhysicalStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'coordinates': instance.coordinates.toJson(),
      'store': instance.store.toJson(),
      'address': instance.address.toJson(),
    };

AcceptingStoreById$Query _$AcceptingStoreById$QueryFromJson(Map<String, dynamic> json) => AcceptingStoreById$Query()
  ..physicalStoresByIdInProject = (json['physicalStoresByIdInProject'] as List<dynamic>)
      .map((e) => e == null ? null : AcceptingStoreById$Query$PhysicalStore.fromJson(e as Map<String, dynamic>))
      .toList();

Map<String, dynamic> _$AcceptingStoreById$QueryToJson(AcceptingStoreById$Query instance) => <String, dynamic>{
      'physicalStoresByIdInProject': instance.physicalStoresByIdInProject.map((e) => e?.toJson()).toList(),
    };

AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$AddressFromJson(Map<String, dynamic> json) =>
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address()..location = json['location'] as String?;

Map<String, dynamic> _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$AddressToJson(
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address instance) =>
    <String, dynamic>{
      'location': instance.location,
    };

AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$CoordinatesFromJson(Map<String, dynamic> json) =>
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates()
          ..lat = (json['lat'] as num).toDouble()
          ..lng = (json['lng'] as num).toDouble();

Map<String, dynamic> _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$CoordinatesToJson(
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates instance) =>
    <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
    };

AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStoreFromJson(Map<String, dynamic> json) =>
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore()
          ..address = AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address.fromJson(
              json['address'] as Map<String, dynamic>)
          ..coordinates = AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates.fromJson(
              json['coordinates'] as Map<String, dynamic>);

Map<String, dynamic> _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStoreToJson(
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore instance) =>
    <String, dynamic>{
      'address': instance.address.toJson(),
      'coordinates': instance.coordinates.toJson(),
    };

AcceptingStoresSearch$Query$AcceptingStore _$AcceptingStoresSearch$Query$AcceptingStoreFromJson(
        Map<String, dynamic> json) =>
    AcceptingStoresSearch$Query$AcceptingStore()
      ..id = json['id'] as int
      ..name = json['name'] as String?
      ..description = json['description'] as String?
      ..physicalStore = json['physicalStore'] == null
          ? null
          : AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore.fromJson(
              json['physicalStore'] as Map<String, dynamic>)
      ..categoryId = json['categoryId'] as int;

Map<String, dynamic> _$AcceptingStoresSearch$Query$AcceptingStoreToJson(
        AcceptingStoresSearch$Query$AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'physicalStore': instance.physicalStore?.toJson(),
      'categoryId': instance.categoryId,
    };

AcceptingStoresSearch$Query _$AcceptingStoresSearch$QueryFromJson(Map<String, dynamic> json) =>
    AcceptingStoresSearch$Query()
      ..searchAcceptingStoresInProject = (json['searchAcceptingStoresInProject'] as List<dynamic>)
          .map((e) => AcceptingStoresSearch$Query$AcceptingStore.fromJson(e as Map<String, dynamic>))
          .toList();

Map<String, dynamic> _$AcceptingStoresSearch$QueryToJson(AcceptingStoresSearch$Query instance) => <String, dynamic>{
      'searchAcceptingStoresInProject': instance.searchAcceptingStoresInProject.map((e) => e.toJson()).toList(),
    };

SearchParamsInput _$SearchParamsInputFromJson(Map<String, dynamic> json) => SearchParamsInput(
      categoryIds: (json['categoryIds'] as List<dynamic>?)?.map((e) => e as int).toList(),
      coordinates:
          json['coordinates'] == null ? null : CoordinatesInput.fromJson(json['coordinates'] as Map<String, dynamic>),
      limit: json['limit'] as int?,
      offset: json['offset'] as int?,
      searchText: json['searchText'] as String?,
    );

Map<String, dynamic> _$SearchParamsInputToJson(SearchParamsInput instance) => <String, dynamic>{
      'categoryIds': instance.categoryIds,
      'coordinates': instance.coordinates?.toJson(),
      'limit': instance.limit,
      'offset': instance.offset,
      'searchText': instance.searchText,
    };

CoordinatesInput _$CoordinatesInputFromJson(Map<String, dynamic> json) => CoordinatesInput(
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
    );

Map<String, dynamic> _$CoordinatesInputToJson(CoordinatesInput instance) => <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
    };

GetRegionsById$Query$Region _$GetRegionsById$Query$RegionFromJson(Map<String, dynamic> json) =>
    GetRegionsById$Query$Region()
      ..id = json['id'] as int
      ..prefix = json['prefix'] as String
      ..name = json['name'] as String;

Map<String, dynamic> _$GetRegionsById$Query$RegionToJson(GetRegionsById$Query$Region instance) => <String, dynamic>{
      'id': instance.id,
      'prefix': instance.prefix,
      'name': instance.name,
    };

GetRegionsById$Query _$GetRegionsById$QueryFromJson(Map<String, dynamic> json) => GetRegionsById$Query()
  ..regionsByIdInProject = (json['regionsByIdInProject'] as List<dynamic>)
      .map((e) => e == null ? null : GetRegionsById$Query$Region.fromJson(e as Map<String, dynamic>))
      .toList();

Map<String, dynamic> _$GetRegionsById$QueryToJson(GetRegionsById$Query instance) => <String, dynamic>{
      'regionsByIdInProject': instance.regionsByIdInProject.map((e) => e?.toJson()).toList(),
    };

GetRegions$Query$Region _$GetRegions$Query$RegionFromJson(Map<String, dynamic> json) => GetRegions$Query$Region()
  ..id = json['id'] as int
  ..prefix = json['prefix'] as String
  ..name = json['name'] as String;

Map<String, dynamic> _$GetRegions$Query$RegionToJson(GetRegions$Query$Region instance) => <String, dynamic>{
      'id': instance.id,
      'prefix': instance.prefix,
      'name': instance.name,
    };

GetRegions$Query _$GetRegions$QueryFromJson(Map<String, dynamic> json) => GetRegions$Query()
  ..regionsInProject = (json['regionsInProject'] as List<dynamic>)
      .map((e) => GetRegions$Query$Region.fromJson(e as Map<String, dynamic>))
      .toList();

Map<String, dynamic> _$GetRegions$QueryToJson(GetRegions$Query instance) => <String, dynamic>{
      'regionsInProject': instance.regionsInProject.map((e) => e.toJson()).toList(),
    };

CardVerificationByHashArguments _$CardVerificationByHashArgumentsFromJson(Map<String, dynamic> json) =>
    CardVerificationByHashArguments(
      project: json['project'] as String,
      card: CardVerificationModelInput.fromJson(json['card'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$CardVerificationByHashArgumentsToJson(CardVerificationByHashArguments instance) =>
    <String, dynamic>{
      'project': instance.project,
      'card': instance.card.toJson(),
    };

AcceptingStoreSummaryByIdArguments _$AcceptingStoreSummaryByIdArgumentsFromJson(Map<String, dynamic> json) =>
    AcceptingStoreSummaryByIdArguments(
      project: json['project'] as String,
      ids: (json['ids'] as List<dynamic>).map((e) => e as int).toList(),
    );

Map<String, dynamic> _$AcceptingStoreSummaryByIdArgumentsToJson(AcceptingStoreSummaryByIdArguments instance) =>
    <String, dynamic>{
      'project': instance.project,
      'ids': instance.ids,
    };

AcceptingStoreByIdArguments _$AcceptingStoreByIdArgumentsFromJson(Map<String, dynamic> json) =>
    AcceptingStoreByIdArguments(
      project: json['project'] as String,
      ids: (json['ids'] as List<dynamic>).map((e) => e as int).toList(),
    );

Map<String, dynamic> _$AcceptingStoreByIdArgumentsToJson(AcceptingStoreByIdArguments instance) => <String, dynamic>{
      'project': instance.project,
      'ids': instance.ids,
    };

AcceptingStoresSearchArguments _$AcceptingStoresSearchArgumentsFromJson(Map<String, dynamic> json) =>
    AcceptingStoresSearchArguments(
      project: json['project'] as String,
      params: SearchParamsInput.fromJson(json['params'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AcceptingStoresSearchArgumentsToJson(AcceptingStoresSearchArguments instance) =>
    <String, dynamic>{
      'project': instance.project,
      'params': instance.params.toJson(),
    };

GetRegionsByIdArguments _$GetRegionsByIdArgumentsFromJson(Map<String, dynamic> json) => GetRegionsByIdArguments(
      project: json['project'] as String,
      ids: (json['ids'] as List<dynamic>).map((e) => e as int).toList(),
    );

Map<String, dynamic> _$GetRegionsByIdArgumentsToJson(GetRegionsByIdArguments instance) => <String, dynamic>{
      'project': instance.project,
      'ids': instance.ids,
    };

GetRegionsArguments _$GetRegionsArgumentsFromJson(Map<String, dynamic> json) => GetRegionsArguments(
      project: json['project'] as String,
    );

Map<String, dynamic> _$GetRegionsArgumentsToJson(GetRegionsArguments instance) => <String, dynamic>{
      'project': instance.project,
    };
