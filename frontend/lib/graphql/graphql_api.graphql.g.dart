// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'graphql_api.graphql.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

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
    ..regions = (json['regions'] as List)
        ?.map((e) => e == null
            ? null
            : GetRegions$Query$Region.fromJson(e as Map<String, dynamic>))
        ?.toList();
}

Map<String, dynamic> _$GetRegions$QueryToJson(GetRegions$Query instance) =>
    <String, dynamic>{
      'regions': instance.regions?.map((e) => e?.toJson())?.toList(),
    };

AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address
    _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$AddressFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address()
    ..location = json['location'] as String;
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
    ..lat = (json['lat'] as num)?.toDouble()
    ..lng = (json['lng'] as num)?.toDouble();
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
    ..address = json['address'] == null
        ? null
        : AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Address
            .fromJson(json['address'] as Map<String, dynamic>)
    ..coordinates = json['coordinates'] == null
        ? null
        : AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore$Coordinates
            .fromJson(json['coordinates'] as Map<String, dynamic>);
}

Map<String,
    dynamic> _$AcceptingStoresSearch$Query$AcceptingStore$PhysicalStoreToJson(
        AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore instance) =>
    <String, dynamic>{
      'address': instance.address?.toJson(),
      'coordinates': instance.coordinates?.toJson(),
    };

AcceptingStoresSearch$Query$AcceptingStore
    _$AcceptingStoresSearch$Query$AcceptingStoreFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoresSearch$Query$AcceptingStore()
    ..id = json['id'] as int
    ..name = json['name'] as String
    ..description = json['description'] as String
    ..physicalStore = json['physicalStore'] == null
        ? null
        : AcceptingStoresSearch$Query$AcceptingStore$PhysicalStore.fromJson(
            json['physicalStore'] as Map<String, dynamic>);
}

Map<String, dynamic> _$AcceptingStoresSearch$Query$AcceptingStoreToJson(
        AcceptingStoresSearch$Query$AcceptingStore instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'physicalStore': instance.physicalStore?.toJson(),
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

CoordinatesInput _$CoordinatesInputFromJson(Map<String, dynamic> json) {
  return CoordinatesInput(
    lat: (json['lat'] as num)?.toDouble(),
    lng: (json['lng'] as num)?.toDouble(),
  );
}

Map<String, dynamic> _$CoordinatesInputToJson(CoordinatesInput instance) =>
    <String, dynamic>{
      'lat': instance.lat,
      'lng': instance.lng,
    };

SearchParamsInput _$SearchParamsInputFromJson(Map<String, dynamic> json) {
  return SearchParamsInput(
    categoryIds: (json['categoryIds'] as List)?.map((e) => e as int)?.toList(),
    coordinates: json['coordinates'] == null
        ? null
        : CoordinatesInput.fromJson(
            json['coordinates'] as Map<String, dynamic>),
    limit: json['limit'] as int,
    offset: json['offset'] as int,
    searchText: json['searchText'] as String,
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

AcceptingStoreById$Query$PhysicalStore$Coordinates
    _$AcceptingStoreById$Query$PhysicalStore$CoordinatesFromJson(
        Map<String, dynamic> json) {
  return AcceptingStoreById$Query$PhysicalStore$Coordinates()
    ..lat = (json['lat'] as num)?.toDouble()
    ..lng = (json['lng'] as num)?.toDouble();
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
    ..id = json['id'] as int
    ..coordinates = json['coordinates'] == null
        ? null
        : AcceptingStoreById$Query$PhysicalStore$Coordinates.fromJson(
            json['coordinates'] as Map<String, dynamic>)
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
      'id': instance.id,
      'coordinates': instance.coordinates?.toJson(),
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

CardVerificationByHash$Query _$CardVerificationByHash$QueryFromJson(
    Map<String, dynamic> json) {
  return CardVerificationByHash$Query()
    ..cardValid = json['cardValid'] as bool;
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

AttachmentInput _$AttachmentInputFromJson(Map<String, dynamic> json) {
  return AttachmentInput(
    fileName: json['fileName'] as String,
  );
}

Map<String, dynamic> _$AttachmentInputToJson(AttachmentInput instance) =>
    <String, dynamic>{
      'fileName': instance.fileName,
    };

BlueCardEntitlementInput _$BlueCardEntitlementInputFromJson(
    Map<String, dynamic> json) {
  return BlueCardEntitlementInput(
    blueEntitlementType: _$enumDecodeNullable(
        _$BlueCardEntitlementTypeEnumMap, json['blueEntitlementType'],
        unknownValue: BlueCardEntitlementType.artemisUnknown),
    copyOfJuleica: json['copyOfJuleica'] == null
        ? null
        : AttachmentInput.fromJson(
        json['copyOfJuleica'] as Map<String, dynamic>),
    juleicaExpirationDate: json['juleicaExpirationDate'] as String,
    juleicaNumber: json['juleicaNumber'] as String,
    serviceActivity: _$enumDecodeNullable(
        _$BlueCardServiceEntitlementActivityEnumMap, json['serviceActivity'],
        unknownValue: BlueCardServiceEntitlementActivity.artemisUnknown),
    serviceCertificate: json['serviceCertificate'] == null
        ? null
        : AttachmentInput.fromJson(
        json['serviceCertificate'] as Map<String, dynamic>),
    workAtOrganizations: (json['workAtOrganizations'] as List)
        ?.map((e) =>
    e == null
        ? null
        : WorkAtOrganizationInput.fromJson(e as Map<String, dynamic>))
        ?.toList(),
  );
}

Map<String, dynamic> _$BlueCardEntitlementInputToJson(
    BlueCardEntitlementInput instance) =>
    <String, dynamic>{
      'blueEntitlementType':
      _$BlueCardEntitlementTypeEnumMap[instance.blueEntitlementType],
      'copyOfJuleica': instance.copyOfJuleica?.toJson(),
      'juleicaExpirationDate': instance.juleicaExpirationDate,
      'juleicaNumber': instance.juleicaNumber,
      'serviceActivity':
      _$BlueCardServiceEntitlementActivityEnumMap[instance.serviceActivity],
      'serviceCertificate': instance.serviceCertificate?.toJson(),
      'workAtOrganizations':
      instance.workAtOrganizations?.map((e) => e?.toJson())?.toList(),
    };

T _$enumDecode<T>(Map<T, dynamic> enumValues,
    dynamic source, {
      T unknownValue,
    }) {
  if (source == null) {
    throw ArgumentError('A value must be provided. Supported values: '
        '${enumValues.values.join(', ')}');
  }

  final value = enumValues.entries
      .singleWhere((e) => e.value == source, orElse: () => null)
      ?.key;

  if (value == null && unknownValue == null) {
    throw ArgumentError('`$source` is not one of the supported values: '
        '${enumValues.values.join(', ')}');
  }
  return value ?? unknownValue;
}

T _$enumDecodeNullable<T>(Map<T, dynamic> enumValues,
    dynamic source, {
      T unknownValue,
    }) {
  if (source == null) {
    return null;
  }
  return _$enumDecode<T>(enumValues, source, unknownValue: unknownValue);
}

const _$BlueCardEntitlementTypeEnumMap = {
  BlueCardEntitlementType.juleica: 'JULEICA',
  BlueCardEntitlementType.service: 'SERVICE',
  BlueCardEntitlementType.standard: 'STANDARD',
  BlueCardEntitlementType.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

const _$BlueCardServiceEntitlementActivityEnumMap = {
  BlueCardServiceEntitlementActivity.disasterControl: 'DISASTER_CONTROL',
  BlueCardServiceEntitlementActivity.fireDepartment: 'FIRE_DEPARTMENT',
  BlueCardServiceEntitlementActivity.rescueService: 'RESCUE_SERVICE',
  BlueCardServiceEntitlementActivity.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

BlueEakCardApplicationInput _$BlueEakCardApplicationInputFromJson(
    Map<String, dynamic> json) {
  return BlueEakCardApplicationInput(
    applicationType: _$enumDecodeNullable(
        _$ApplicationTypeEnumMap, json['applicationType'],
        unknownValue: ApplicationType.artemisUnknown),
    entitlement: json['entitlement'] == null
        ? null
        : BlueCardEntitlementInput.fromJson(
        json['entitlement'] as Map<String, dynamic>),
    givenInformationIsCorrectAndComplete:
    json['givenInformationIsCorrectAndComplete'] as bool,
    hasAcceptedPrivacyPolicy: json['hasAcceptedPrivacyPolicy'] as bool,
    personalData: json['personalData'] == null
        ? null
        : PersonalDataInput.fromJson(
        json['personalData'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$BlueEakCardApplicationInputToJson(
    BlueEakCardApplicationInput instance) =>
    <String, dynamic>{
      'applicationType': _$ApplicationTypeEnumMap[instance.applicationType],
      'entitlement': instance.entitlement?.toJson(),
      'givenInformationIsCorrectAndComplete':
      instance.givenInformationIsCorrectAndComplete,
      'hasAcceptedPrivacyPolicy': instance.hasAcceptedPrivacyPolicy,
      'personalData': instance.personalData?.toJson(),
    };

const _$ApplicationTypeEnumMap = {
  ApplicationType.firstApplication: 'FIRST_APPLICATION',
  ApplicationType.renewalApplication: 'RENEWAL_APPLICATION',
  ApplicationType.artemisUnknown: 'ARTEMIS_UNKNOWN',
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

OrganizationInput _$OrganizationInputFromJson(Map<String, dynamic> json) {
  return OrganizationInput(
    contact: json['contact'] == null
        ? null
        : OrganizationContactInput.fromJson(
        json['contact'] as Map<String, dynamic>),
    name: json['name'] as String,
  );
}

Map<String, dynamic> _$OrganizationInputToJson(OrganizationInput instance) =>
    <String, dynamic>{
      'contact': instance.contact?.toJson(),
      'name': instance.name,
    };

PersonalDataInput _$PersonalDataInputFromJson(Map<String, dynamic> json) {
  return PersonalDataInput(
    addressSupplement: json['addressSupplement'] as String,
    dateOfBirth: json['dateOfBirth'] as String,
    emailAddress: json['emailAddress'] as String,
    forenames: json['forenames'] as String,
    gender: json['gender'] as String,
    houseNumber: json['houseNumber'] as String,
    location: json['location'] as String,
    nationality: json['nationality'] as String,
    postalCode: json['postalCode'] as String,
    street: json['street'] as String,
    surname: json['surname'] as String,
    telephone: json['telephone'] as String,
    title: json['title'] as String,
  );
}

Map<String, dynamic> _$PersonalDataInputToJson(PersonalDataInput instance) =>
    <String, dynamic>{
      'addressSupplement': instance.addressSupplement,
      'dateOfBirth': instance.dateOfBirth,
      'emailAddress': instance.emailAddress,
      'forenames': instance.forenames,
      'gender': instance.gender,
      'houseNumber': instance.houseNumber,
      'location': instance.location,
      'nationality': instance.nationality,
      'postalCode': instance.postalCode,
      'street': instance.street,
      'surname': instance.surname,
      'telephone': instance.telephone,
      'title': instance.title,
    };

WorkAtOrganizationInput _$WorkAtOrganizationInputFromJson(
    Map<String, dynamic> json) {
  return WorkAtOrganizationInput(
    amountOfWork: (json['amountOfWork'] as num)?.toDouble(),
    amountOfWorkUnit: _$enumDecodeNullable(
        _$AmountOfWorkUnitEnumMap, json['amountOfWorkUnit'],
        unknownValue: AmountOfWorkUnit.artemisUnknown),
    certificate: json['certificate'] == null
        ? null
        : AttachmentInput.fromJson(json['certificate'] as Map<String, dynamic>),
    organization: json['organization'] == null
        ? null
        : OrganizationInput.fromJson(
        json['organization'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$WorkAtOrganizationInputToJson(
    WorkAtOrganizationInput instance) =>
    <String, dynamic>{
      'amountOfWork': instance.amountOfWork,
      'amountOfWorkUnit': _$AmountOfWorkUnitEnumMap[instance.amountOfWorkUnit],
      'certificate': instance.certificate?.toJson(),
      'organization': instance.organization?.toJson(),
    };

const _$AmountOfWorkUnitEnumMap = {
  AmountOfWorkUnit.hoursPerWeek: 'HOURS_PER_WEEK',
  AmountOfWorkUnit.hoursPerYear: 'HOURS_PER_YEAR',
  AmountOfWorkUnit.artemisUnknown: 'ARTEMIS_UNKNOWN',
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

GoldenCardEntitlementInput _$GoldenCardEntitlementInputFromJson(
    Map<String, dynamic> json) {
  return GoldenCardEntitlementInput(
    certificate: json['certificate'] == null
        ? null
        : AttachmentInput.fromJson(json['certificate'] as Map<String, dynamic>),
    goldenEntitlementType: _$enumDecodeNullable(
        _$GoldenCardEntitlementTypeEnumMap, json['goldenEntitlementType'],
        unknownValue: GoldenCardEntitlementType.artemisUnknown),
    workAtOrganizations: (json['workAtOrganizations'] as List)
        ?.map((e) =>
    e == null
        ? null
        : WorkAtOrganizationInput.fromJson(e as Map<String, dynamic>))
        ?.toList(),
  );
}

Map<String, dynamic> _$GoldenCardEntitlementInputToJson(
    GoldenCardEntitlementInput instance) =>
    <String, dynamic>{
      'certificate': instance.certificate?.toJson(),
      'goldenEntitlementType':
      _$GoldenCardEntitlementTypeEnumMap[instance.goldenEntitlementType],
      'workAtOrganizations':
      instance.workAtOrganizations?.map((e) => e?.toJson())?.toList(),
    };

const _$GoldenCardEntitlementTypeEnumMap = {
  GoldenCardEntitlementType.honorByMinisterPresident:
  'HONOR_BY_MINISTER_PRESIDENT',
  GoldenCardEntitlementType.serviceAward: 'SERVICE_AWARD',
  GoldenCardEntitlementType.standard: 'STANDARD',
  GoldenCardEntitlementType.artemisUnknown: 'ARTEMIS_UNKNOWN',
};

GoldenEakCardApplicationInput _$GoldenEakCardApplicationInputFromJson(
    Map<String, dynamic> json) {
  return GoldenEakCardApplicationInput(
    entitlement: json['entitlement'] == null
        ? null
        : GoldenCardEntitlementInput.fromJson(
        json['entitlement'] as Map<String, dynamic>),
    givenInformationIsCorrectAndComplete:
    json['givenInformationIsCorrectAndComplete'] as bool,
    hasAcceptedPrivacyPolicy: json['hasAcceptedPrivacyPolicy'] as bool,
    personalData: json['personalData'] == null
        ? null
        : PersonalDataInput.fromJson(
        json['personalData'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$GoldenEakCardApplicationInputToJson(
    GoldenEakCardApplicationInput instance) =>
    <String, dynamic>{
      'entitlement': instance.entitlement?.toJson(),
      'givenInformationIsCorrectAndComplete':
      instance.givenInformationIsCorrectAndComplete,
      'hasAcceptedPrivacyPolicy': instance.hasAcceptedPrivacyPolicy,
      'personalData': instance.personalData?.toJson(),
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

CardVerificationByHashArguments _$CardVerificationByHashArgumentsFromJson(
    Map<String, dynamic> json) {
  return CardVerificationByHashArguments(
    card: json['card'] == null
        ? null
        : CardVerificationModelInput.fromJson(
        json['card'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$CardVerificationByHashArgumentsToJson(
    CardVerificationByHashArguments instance) =>
    <String, dynamic>{
      'card': instance.card?.toJson(),
    };

AddBlueEakApplicationArguments _$AddBlueEakApplicationArgumentsFromJson(
    Map<String, dynamic> json) {
  return AddBlueEakApplicationArguments(
    application: json['application'] == null
        ? null
        : BlueEakCardApplicationInput.fromJson(
        json['application'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AddBlueEakApplicationArgumentsToJson(
    AddBlueEakApplicationArguments instance) =>
    <String, dynamic>{
      'application': instance.application?.toJson(),
    };

AddGoldenEakApplicationArguments _$AddGoldenEakApplicationArgumentsFromJson(
    Map<String, dynamic> json) {
  return AddGoldenEakApplicationArguments(
    application: json['application'] == null
        ? null
        : GoldenEakCardApplicationInput.fromJson(
        json['application'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$AddGoldenEakApplicationArgumentsToJson(
    AddGoldenEakApplicationArguments instance) =>
    <String, dynamic>{
      'application': instance.application?.toJson(),
    };
