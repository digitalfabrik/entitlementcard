// GENERATED CODE - DO NOT MODIFY BY HAND
// @dart=2.12

part of 'graphql_api.graphql.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GetRegionsById$Query$Region _$GetRegionsById$Query$RegionFromJson(
    Map<String, dynamic> json) {
  return GetRegionsById$Query$Region()
    ..id = json['id'] as int
    ..prefix = json['prefix'] as String
    ..name = json['name'] as String;
}

Map<String, dynamic> _$GetRegionsById$Query$RegionToJson(
        GetRegionsById$Query$Region instance) =>
    <String, dynamic>{
      'id': instance.id,
      'prefix': instance.prefix,
      'name': instance.name,
    };

GetRegionsById$Query _$GetRegionsById$QueryFromJson(Map<String, dynamic> json) {
  return GetRegionsById$Query()
    ..regionsById = (json['regionsById'] as List<dynamic>)
        .map((e) =>
            GetRegionsById$Query$Region.fromJson(e as Map<String, dynamic>))
        .toList();
}

Map<String, dynamic> _$GetRegionsById$QueryToJson(
        GetRegionsById$Query instance) =>
    <String, dynamic>{
      'regionsById': instance.regionsById.map((e) => e.toJson()).toList(),
    };

IdsParamsInput _$IdsParamsInputFromJson(Map<String, dynamic> json) {
  return IdsParamsInput(
    ids: (json['ids'] as List<dynamic>).map((e) => e as int).toList(),
  );
}

Map<String, dynamic> _$IdsParamsInputToJson(IdsParamsInput instance) =>
    <String, dynamic>{
      'ids': instance.ids,
    };

GetRegions$Query$Region _$GetRegions$Query$RegionFromJson(
    Map<String, dynamic> json) {
  return GetRegions$Query$Region()
    ..id = json['id'] as int
    ..prefix = json['prefix'] as String
    ..name = json['name'] as String;
}

Map<String, dynamic> _$GetRegions$Query$RegionToJson(
        GetRegions$Query$Region instance) =>
    <String, dynamic>{
      'id': instance.id,
      'prefix': instance.prefix,
      'name': instance.name,
    };

GetRegions$Query _$GetRegions$QueryFromJson(Map<String, dynamic> json) {
  return GetRegions$Query()
    ..regions = (json['regions'] as List<dynamic>)
        .map((e) => GetRegions$Query$Region.fromJson(e as Map<String, dynamic>))
        .toList();
}

Map<String, dynamic> _$GetRegions$QueryToJson(GetRegions$Query instance) =>
    <String, dynamic>{
      'regions': instance.regions.map((e) => e.toJson()).toList(),
    };

AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$AddressFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address()
    ..location = json['location'] as String?;
}

Map<String, dynamic>
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$AddressToJson(
            AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address
                instance) =>
        <String, dynamic>{
          'location': instance.location,
        };

AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$CoordinatesFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates()
    ..lat = (json['lat'] as num).toDouble()
    ..lng = (json['lng'] as num).toDouble();
}

Map<String, dynamic>
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$CoordinatesToJson(
            AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates
                instance) =>
        <String, dynamic>{
          'lat': instance.lat,
          'lng': instance.lng,
        };

AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore()
    ..address = AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address
        .fromJson(json['address'] as Map<String, dynamic>)
    ..coordinates =
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates
            .fromJson(json['coordinates'] as Map<String, dynamic>);
}

Map<String,
    dynamic> _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStoreToJson(
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore instance) =>
    <String, dynamic>{
      'address': instance.address.toJson(),
      'coordinates': instance.coordinates.toJson(),
    };

AcceptingStoresSearch$Query$AcceptingStore
    _$AcceptingStoresSearch$Query$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query$AcceptingStore()
    ..id = json['id'] as int
    ..name = json['name'] as String?
    ..description = json['description'] as String?
    ..physicalStore = json['physicalStore'] == null
        ? null
        : AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore.fromJson(
            json['physicalStore'] as Map<String, dynamic>)
    ..categoryId = json['categoryId'] as int;
}

Map<String, dynamic> _$AcceptingStoresSearch$Query$AcceptingStoreToJson(
        AcceptingStoresSearch$Query$AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'physicalStore': instance.physicalStore?.toJson(),
      'categoryId': instance.categoryId,
    };

AcceptingStoresSearch$Query _$AcceptingStoresSearch$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query()
    ..searchAcceptingStores = (json['searchAcceptingStores'] as List<dynamic>)
        .map((e) => AcceptingStoresSearch$Query$AcceptingStore.fromJson(
            e as Map<String, dynamic>))
        .toList();
}

Map<String, dynamic> _$AcceptingStoresSearch$QueryToJson(
        AcceptingStoresSearch$Query instance) =>
    <String, dynamic>{
      'searchAcceptingStores':
          instance.searchAcceptingStores.map((e) => e.toJson()).toList(),
    };

SearchParamsInput _$SearchParamsInputFromJson(Map<String, dynamic> json) {
  return SearchParamsInput(
    categoryIds:
        (json['categoryIds'] as List<dynamic>?)?.map((e) => e as int).toList(),
    coordinates: json['coordinates'] == null
        ? null
        : CoordinatesInput.fromJson(
            json['coordinates'] as Map<String, dynamic>),
    limit: json['limit'] as int?,
    offset: json['offset'] as int?,
    searchText: json['searchText'] as String?,
  );
}

Map<String, dynamic> _$SearchParamsInputToJson(SearchParamsInput instance) =>
    <String, dynamic>{
      'categoryIds': instance.categoryIds,
      'coordinates': instance.coordinates?.toJson(),
      'limit': instance.limit,
      'offset': instance.offset,
      'searchText': instance.searchText,
    };

CoordinatesInput _$CoordinatesInputFromJson(Map<String, dynamic> json) {
  return CoordinatesInput(
    lat: (json['lat'] as num).toDouble(),
    lng: (json['lng'] as num).toDouble(),
  );
}

Map<String, dynamic> _$CoordinatesInputToJson(CoordinatesInput instance) =>
    <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
    };

AcceptingStoreById$Query$PhysicalStore$Coordinates
    _$AcceptingStoreById$Query$PhysicalStore$CoordinatesFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore$Coordinates()
    ..lat = (json['lat'] as num).toDouble()
    ..lng = (json['lng'] as num).toDouble();
}

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStore$CoordinatesToJson(
        AcceptingStoreById$Query$PhysicalStore$Coordinates instance) =>
    <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
    };

AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStore$ContactFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact()
    ..id = json['id'] as int
    ..email = json['email'] as String?
    ..telephone = json['telephone'] as String?
    ..website = json['website'] as String?;
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
    ..name = json['name'] as String?
    ..description = json['description'] as String?
    ..contact =
        AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Contact.fromJson(
            json['contact'] as Map<String, dynamic>)
    ..category =
        AcceptingStoreById$Query$PhysicalStore$AcceptingStore$Category.fromJson(
            json['category'] as Map<String, dynamic>);
}

Map<String, dynamic>
    _$AcceptingStoreById$Query$PhysicalStore$AcceptingStoreToJson(
            AcceptingStoreById$Query$PhysicalStore$AcceptingStore instance) =>
        <String, dynamic>{
          'id': instance.id,
          'name': instance.name,
          'description': instance.description,
          'contact': instance.contact.toJson(),
          'category': instance.category.toJson(),
        };

AcceptingStoreById$Query$PhysicalStore$Address
    _$AcceptingStoreById$Query$PhysicalStore$AddressFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore$Address()
    ..street = json['street'] as String?
    ..postalCode = json['postalCode'] as String?
    ..location = json['location'] as String?;
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
    ..id = json['id'] as int
    ..coordinates = AcceptingStoreById$Query$PhysicalStore$Coordinates.fromJson(
        json['coordinates'] as Map<String, dynamic>)
    ..store = AcceptingStoreById$Query$PhysicalStore$AcceptingStore.fromJson(
        json['store'] as Map<String, dynamic>)
    ..address = AcceptingStoreById$Query$PhysicalStore$Address.fromJson(
        json['address'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStoreById$Query$PhysicalStoreToJson(
        AcceptingStoreById$Query$PhysicalStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'coordinates': instance.coordinates.toJson(),
      'store': instance.store.toJson(),
      'address': instance.address.toJson(),
    };

AcceptingStoreById$Query _$AcceptingStoreById$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreById$Query()
    ..physicalStoresById = (json['physicalStoresById'] as List<dynamic>)
        .map((e) => AcceptingStoreById$Query$PhysicalStore.fromJson(
            e as Map<String, dynamic>))
        .toList();
}

Map<String, dynamic> _$AcceptingStoreById$QueryToJson(
        AcceptingStoreById$Query instance) =>
    <String, dynamic>{
      'physicalStoresById':
          instance.physicalStoresById.map((e) => e.toJson()).toList(),
    };

AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore
    _$AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore()
    ..name = json['name'] as String?
    ..description = json['description'] as String?
    ..categoryId = json['categoryId'] as int;
}

Map<String, dynamic>
    _$AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStoreToJson(
            AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore
                instance) =>
        <String, dynamic>{
          'name': instance.name,
          'description': instance.description,
          'categoryId': instance.categoryId,
        };

AcceptingStoreSummaryById$Query$PhysicalStore
    _$AcceptingStoreSummaryById$Query$PhysicalStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query$PhysicalStore()
    ..id = json['id'] as int
    ..store =
        AcceptingStoreSummaryById$Query$PhysicalStore$AcceptingStore.fromJson(
            json['store'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStoreSummaryById$Query$PhysicalStoreToJson(
        AcceptingStoreSummaryById$Query$PhysicalStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'store': instance.store.toJson(),
    };

AcceptingStoreSummaryById$Query _$AcceptingStoreSummaryById$QueryFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreSummaryById$Query()
    ..physicalStoresById = (json['physicalStoresById'] as List<dynamic>)
        .map((e) => AcceptingStoreSummaryById$Query$PhysicalStore.fromJson(
            e as Map<String, dynamic>))
        .toList();
}

Map<String, dynamic> _$AcceptingStoreSummaryById$QueryToJson(
        AcceptingStoreSummaryById$Query instance) =>
    <String, dynamic>{
      'physicalStoresById':
          instance.physicalStoresById.map((e) => e.toJson()).toList(),
    };

AddBlueEakApplication$Mutation _$AddBlueEakApplication$MutationFromJson(
    Map<String, dynamic> json) {
  return AddBlueEakApplication$Mutation()
    ..addBlueEakApplication = json['addBlueEakApplication'] as bool;
}

Map<String, dynamic> _$AddBlueEakApplication$MutationToJson(
        AddBlueEakApplication$Mutation instance) =>
    <String, dynamic>{
      'addBlueEakApplication': instance.addBlueEakApplication,
    };

BlueCardApplicationInput _$BlueCardApplicationInputFromJson(
    Map<String, dynamic> json) {
  return BlueCardApplicationInput(
    applicationType: _$enumDecode(
        _$ApplicationTypeEnumMap, json['applicationType'],
        unknownValue: ApplicationType.artemisUnknown),
    entitlement: BlueCardEntitlementInput.fromJson(
        json['entitlement'] as Map<String, dynamic>),
    givenInformationIsCorrectAndComplete:
        json['givenInformationIsCorrectAndComplete'] as bool,
    hasAcceptedPrivacyPolicy: json['hasAcceptedPrivacyPolicy'] as bool,
    personalData: PersonalDataInput.fromJson(
        json['personalData'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$BlueCardApplicationInputToJson(
        BlueCardApplicationInput instance) =>
    <String, dynamic>{
      'applicationType': _$ApplicationTypeEnumMap[instance.applicationType],
      'entitlement': instance.entitlement.toJson(),
      'givenInformationIsCorrectAndComplete':
          instance.givenInformationIsCorrectAndComplete,
      'hasAcceptedPrivacyPolicy': instance.hasAcceptedPrivacyPolicy,
      'personalData': instance.personalData.toJson(),
    };

K _$enumDecode<K, V>(
  Map<K, V> enumValues,
  Object? source, {
  K? unknownValue,
}) {
  if (source == null) {
    throw ArgumentError(
      'A value must be provided. Supported values: '
      '${enumValues.values.join(', ')}',
    );
  }

  return enumValues.entries.singleWhere(
    (e) => e.value == source,
    orElse: () {
      if (unknownValue == null) {
        throw ArgumentError(
          '`$source` is not one of the supported values: '
          '${enumValues.values.join(', ')}',
        );
      }
      return MapEntry(unknownValue, enumValues.values.first);
    },
  ).key;
}

const _$ApplicationTypeEnumMap = {
  ApplicationType.firstApplication: 'FIRST_APPLICATION',
  ApplicationType.renewalApplication: 'RENEWAL_APPLICATION',
  ApplicationType.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

BlueCardEntitlementInput _$BlueCardEntitlementInputFromJson(
    Map<String, dynamic> json) {
  return BlueCardEntitlementInput(
    copyOfJuleica: json['copyOfJuleica'] == null
        ? null
        : AttachmentInput.fromJson(
            json['copyOfJuleica'] as Map<String, dynamic>),
    entitlementType: _$enumDecode(
        _$BlueCardEntitlementTypeEnumMap, json['entitlementType'],
        unknownValue: BlueCardEntitlementType.artemisUnknown),
    juleicaExpirationDate: json['juleicaExpirationDate'] as String?,
    juleicaNumber: json['juleicaNumber'] as String?,
    serviceEntitlement: json['serviceEntitlement'] == null
        ? null
        : BlueCardServiceEntitlementInput.fromJson(
            json['serviceEntitlement'] as Map<String, dynamic>),
    workAtOrganizations: (json['workAtOrganizations'] as List<dynamic>?)
        ?.map(
            (e) => WorkAtOrganizationInput.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}

Map<String, dynamic> _$BlueCardEntitlementInputToJson(
        BlueCardEntitlementInput instance) =>
    <String, dynamic>{
      'copyOfJuleica': instance.copyOfJuleica?.toJson(),
      'entitlementType':
          _$BlueCardEntitlementTypeEnumMap[instance.entitlementType],
      'juleicaExpirationDate': instance.juleicaExpirationDate,
      'juleicaNumber': instance.juleicaNumber,
      'serviceEntitlement': instance.serviceEntitlement?.toJson(),
      'workAtOrganizations':
          instance.workAtOrganizations?.map((e) => e.toJson()).toList(),
    };

const _$BlueCardEntitlementTypeEnumMap = {
  BlueCardEntitlementType.juleica: 'JULEICA',
  BlueCardEntitlementType.service: 'SERVICE',
  BlueCardEntitlementType.standard: 'STANDARD',
  BlueCardEntitlementType.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

AttachmentInput _$AttachmentInputFromJson(Map<String, dynamic> json) {
  return AttachmentInput(
    data: fromGraphQLUploadToDartMultipartFile(json['data'] as MultipartFile),
    fileName: json['fileName'] as String,
  );
}

Map<String, dynamic> _$AttachmentInputToJson(AttachmentInput instance) =>
    <String, dynamic>{
      'data': fromDartMultipartFileToGraphQLUpload(instance.data),
      'fileName': instance.fileName,
    };

BlueCardServiceEntitlementInput _$BlueCardServiceEntitlementInputFromJson(
    Map<String, dynamic> json) {
  return BlueCardServiceEntitlementInput(
    certificate: json['certificate'] == null
        ? null
        : AttachmentInput.fromJson(json['certificate'] as Map<String, dynamic>),
    organization: OrganizationInput.fromJson(
        json['organization'] as Map<String, dynamic>),
    responsibility: json['responsibility'] as String?,
  );
}

Map<String, dynamic> _$BlueCardServiceEntitlementInputToJson(
        BlueCardServiceEntitlementInput instance) =>
    <String, dynamic>{
      'certificate': instance.certificate?.toJson(),
      'organization': instance.organization.toJson(),
      'responsibility': instance.responsibility,
    };

OrganizationInput _$OrganizationInputFromJson(Map<String, dynamic> json) {
  return OrganizationInput(
    address: AddressInput.fromJson(json['address'] as Map<String, dynamic>),
    category: json['category'] as String,
    contact: OrganizationContactInput.fromJson(
        json['contact'] as Map<String, dynamic>),
    name: json['name'] as String,
    website: json['website'] as String?,
  );
}

Map<String, dynamic> _$OrganizationInputToJson(OrganizationInput instance) =>
    <String, dynamic>{
      'address': instance.address.toJson(),
      'category': instance.category,
      'contact': instance.contact.toJson(),
      'name': instance.name,
      'website': instance.website,
    };

AddressInput _$AddressInputFromJson(Map<String, dynamic> json) {
  return AddressInput(
    addressSupplement: json['addressSupplement'] as String?,
    houseNumber: json['houseNumber'] as String,
    location: json['location'] as String,
    postalCode: json['postalCode'] as String,
    street: json['street'] as String,
  );
}

Map<String, dynamic> _$AddressInputToJson(AddressInput instance) =>
    <String, dynamic>{
      'addressSupplement': instance.addressSupplement,
      'houseNumber': instance.houseNumber,
      'location': instance.location,
      'postalCode': instance.postalCode,
      'street': instance.street,
    };

OrganizationContactInput _$OrganizationContactInputFromJson(
    Map<String, dynamic> json) {
  return OrganizationContactInput(
    email: json['email'] as String,
    hasGivenPermission: json['hasGivenPermission'] as bool,
    name: json['name'] as String,
    telephone: json['telephone'] as String,
  );
}

Map<String, dynamic> _$OrganizationContactInputToJson(
        OrganizationContactInput instance) =>
    <String, dynamic>{
      'email': instance.email,
      'hasGivenPermission': instance.hasGivenPermission,
      'name': instance.name,
      'telephone': instance.telephone,
    };

WorkAtOrganizationInput _$WorkAtOrganizationInputFromJson(
    Map<String, dynamic> json) {
  return WorkAtOrganizationInput(
    amountOfWork: (json['amountOfWork'] as num).toDouble(),
    amountOfWorkUnit: _$enumDecode(
        _$AmountOfWorkUnitEnumMap, json['amountOfWorkUnit'],
        unknownValue: AmountOfWorkUnit.artemisUnknown),
    certificate: json['certificate'] == null
        ? null
        : AttachmentInput.fromJson(json['certificate'] as Map<String, dynamic>),
    organization: OrganizationInput.fromJson(
        json['organization'] as Map<String, dynamic>),
    payment: json['payment'] as bool,
    responsibility: json['responsibility'] as String,
    workSinceDate: json['workSinceDate'] as String,
  );
}

Map<String, dynamic> _$WorkAtOrganizationInputToJson(
        WorkAtOrganizationInput instance) =>
    <String, dynamic>{
      'amountOfWork': instance.amountOfWork,
      'amountOfWorkUnit': _$AmountOfWorkUnitEnumMap[instance.amountOfWorkUnit],
      'certificate': instance.certificate?.toJson(),
      'organization': instance.organization.toJson(),
      'payment': instance.payment,
      'responsibility': instance.responsibility,
      'workSinceDate': instance.workSinceDate,
    };

const _$AmountOfWorkUnitEnumMap = {
  AmountOfWorkUnit.hoursPerWeek: 'HOURS_PER_WEEK',
  AmountOfWorkUnit.hoursPerYear: 'HOURS_PER_YEAR',
  AmountOfWorkUnit.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

PersonalDataInput _$PersonalDataInputFromJson(Map<String, dynamic> json) {
  return PersonalDataInput(
    address: AddressInput.fromJson(json['address'] as Map<String, dynamic>),
    dateOfBirth: json['dateOfBirth'] as String,
    emailAddress: json['emailAddress'] as String,
    forenames: json['forenames'] as String,
    gender: json['gender'] as String?,
    nationality: json['nationality'] as String?,
    surname: json['surname'] as String,
    telephone: json['telephone'] as String?,
    title: json['title'] as String?,
  );
}

Map<String, dynamic> _$PersonalDataInputToJson(PersonalDataInput instance) =>
    <String, dynamic>{
      'address': instance.address.toJson(),
      'dateOfBirth': instance.dateOfBirth,
      'emailAddress': instance.emailAddress,
      'forenames': instance.forenames,
      'gender': instance.gender,
      'nationality': instance.nationality,
      'surname': instance.surname,
      'telephone': instance.telephone,
      'title': instance.title,
    };

AddGoldenEakApplication$Mutation _$AddGoldenEakApplication$MutationFromJson(
    Map<String, dynamic> json) {
  return AddGoldenEakApplication$Mutation()
    ..addGoldenEakApplication = json['addGoldenEakApplication'] as bool;
}

Map<String, dynamic> _$AddGoldenEakApplication$MutationToJson(
        AddGoldenEakApplication$Mutation instance) =>
    <String, dynamic>{
      'addGoldenEakApplication': instance.addGoldenEakApplication,
    };

GoldenEakCardApplicationInput _$GoldenEakCardApplicationInputFromJson(
    Map<String, dynamic> json) {
  return GoldenEakCardApplicationInput(
    entitlement: GoldenCardEntitlementInput.fromJson(
        json['entitlement'] as Map<String, dynamic>),
    givenInformationIsCorrectAndComplete:
        json['givenInformationIsCorrectAndComplete'] as bool,
    hasAcceptedPrivacyPolicy: json['hasAcceptedPrivacyPolicy'] as bool,
    personalData: PersonalDataInput.fromJson(
        json['personalData'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$GoldenEakCardApplicationInputToJson(
        GoldenEakCardApplicationInput instance) =>
    <String, dynamic>{
      'entitlement': instance.entitlement.toJson(),
      'givenInformationIsCorrectAndComplete':
          instance.givenInformationIsCorrectAndComplete,
      'hasAcceptedPrivacyPolicy': instance.hasAcceptedPrivacyPolicy,
      'personalData': instance.personalData.toJson(),
    };

GoldenCardEntitlementInput _$GoldenCardEntitlementInputFromJson(
    Map<String, dynamic> json) {
  return GoldenCardEntitlementInput(
    certificate: json['certificate'] == null
        ? null
        : AttachmentInput.fromJson(json['certificate'] as Map<String, dynamic>),
    goldenEntitlementType: _$enumDecode(
        _$GoldenCardEntitlementTypeEnumMap, json['goldenEntitlementType'],
        unknownValue: GoldenCardEntitlementType.artemisUnknown),
    workAtOrganizations: (json['workAtOrganizations'] as List<dynamic>?)
        ?.map(
            (e) => WorkAtOrganizationInput.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}

Map<String, dynamic> _$GoldenCardEntitlementInputToJson(
        GoldenCardEntitlementInput instance) =>
    <String, dynamic>{
      'certificate': instance.certificate?.toJson(),
      'goldenEntitlementType':
          _$GoldenCardEntitlementTypeEnumMap[instance.goldenEntitlementType],
      'workAtOrganizations':
          instance.workAtOrganizations?.map((e) => e.toJson()).toList(),
    };

const _$GoldenCardEntitlementTypeEnumMap = {
  GoldenCardEntitlementType.honorByMinisterPresident:
      'HONOR_BY_MINISTER_PRESIDENT',
  GoldenCardEntitlementType.serviceAward: 'SERVICE_AWARD',
  GoldenCardEntitlementType.standard: 'STANDARD',
  GoldenCardEntitlementType.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

CardVerificationByHash$Query _$CardVerificationByHash$QueryFromJson(
    Map<String, dynamic> json) {
  return CardVerificationByHash$Query()..cardValid = json['cardValid'] as bool;
}

Map<String, dynamic> _$CardVerificationByHash$QueryToJson(
        CardVerificationByHash$Query instance) =>
    <String, dynamic>{
      'cardValid': instance.cardValid,
    };

CardVerificationModelInput _$CardVerificationModelInputFromJson(
    Map<String, dynamic> json) {
  return CardVerificationModelInput(
    cardDetailsHashBase64: json['cardDetailsHashBase64'] as String,
    totp: json['totp'] as int,
  );
}

Map<String, dynamic> _$CardVerificationModelInputToJson(
        CardVerificationModelInput instance) =>
    <String, dynamic>{
      'cardDetailsHashBase64': instance.cardDetailsHashBase64,
      'totp': instance.totp,
    };

GetRegionsByIdArguments _$GetRegionsByIdArgumentsFromJson(
    Map<String, dynamic> json) {
  return GetRegionsByIdArguments(
    ids: IdsParamsInput.fromJson(json['ids'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$GetRegionsByIdArgumentsToJson(
        GetRegionsByIdArguments instance) =>
    <String, dynamic>{
      'ids': instance.ids.toJson(),
    };

AcceptingStoresSearchArguments _$AcceptingStoresSearchArgumentsFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoresSearchArguments(
    params: SearchParamsInput.fromJson(json['params'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AcceptingStoresSearchArgumentsToJson(
        AcceptingStoresSearchArguments instance) =>
    <String, dynamic>{
      'params': instance.params.toJson(),
    };

AcceptingStoreByIdArguments _$AcceptingStoreByIdArgumentsFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreByIdArguments(
    ids: IdsParamsInput.fromJson(json['ids'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AcceptingStoreByIdArgumentsToJson(
        AcceptingStoreByIdArguments instance) =>
    <String, dynamic>{
      'ids': instance.ids.toJson(),
    };

AcceptingStoreSummaryByIdArguments _$AcceptingStoreSummaryByIdArgumentsFromJson(
    Map<String, dynamic> json) {
  return AcceptingStoreSummaryByIdArguments(
    ids: IdsParamsInput.fromJson(json['ids'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AcceptingStoreSummaryByIdArgumentsToJson(
        AcceptingStoreSummaryByIdArguments instance) =>
    <String, dynamic>{
      'ids': instance.ids.toJson(),
    };

AddBlueEakApplicationArguments _$AddBlueEakApplicationArgumentsFromJson(
    Map<String, dynamic> json) {
  return AddBlueEakApplicationArguments(
    application: BlueCardApplicationInput.fromJson(
        json['application'] as Map<String, dynamic>),
    regionId: json['regionId'] as int,
  );
}

Map<String, dynamic> _$AddBlueEakApplicationArgumentsToJson(
        AddBlueEakApplicationArguments instance) =>
    <String, dynamic>{
      'application': instance.application.toJson(),
      'regionId': instance.regionId,
    };

AddGoldenEakApplicationArguments _$AddGoldenEakApplicationArgumentsFromJson(
    Map<String, dynamic> json) {
  return AddGoldenEakApplicationArguments(
    application: GoldenEakCardApplicationInput.fromJson(
        json['application'] as Map<String, dynamic>),
    regionId: json['regionId'] as int,
  );
}

Map<String, dynamic> _$AddGoldenEakApplicationArgumentsToJson(
        AddGoldenEakApplicationArguments instance) =>
    <String, dynamic>{
      'application': instance.application.toJson(),
      'regionId': instance.regionId,
    };

CardVerificationByHashArguments _$CardVerificationByHashArgumentsFromJson(
    Map<String, dynamic> json) {
  return CardVerificationByHashArguments(
    card: CardVerificationModelInput.fromJson(
        json['card'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$CardVerificationByHashArgumentsToJson(
        CardVerificationByHashArguments instance) =>
    <String, dynamic>{
      'card': instance.card.toJson(),
    };
