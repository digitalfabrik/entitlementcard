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

  late List<GetRegionsById$Query$Region> regionsById;

  @override
  List<Object?> get props => [regionsById];
  @override
  Map<String, dynamic> toJson() => _$GetRegionsById$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class IdsParamsInput extends JsonSerializable with EquatableMixin {
  IdsParamsInput({required this.ids});

  factory IdsParamsInput.fromJson(Map<String, dynamic> json) =>
      _$IdsParamsInputFromJson(json);

  late List<int> ids;

  @override
  List<Object?> get props => [ids];
  @override
  Map<String, dynamic> toJson() => _$IdsParamsInputToJson(this);
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

  late List<AcceptingStoreById$Query$PhysicalStore> physicalStoresById;

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

  late List<AcceptingStoreSummaryById$Query$PhysicalStore> physicalStoresById;

  @override
  List<Object?> get props => [physicalStoresById];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreSummaryById$QueryToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AddBlueEakApplication$Mutation extends JsonSerializable
    with EquatableMixin {
  AddBlueEakApplication$Mutation();

  factory AddBlueEakApplication$Mutation.fromJson(Map<String, dynamic> json) =>
      _$AddBlueEakApplication$MutationFromJson(json);

  late bool addBlueEakApplication;

  @override
  List<Object?> get props => [addBlueEakApplication];
  @override
  Map<String, dynamic> toJson() => _$AddBlueEakApplication$MutationToJson(this);
}

@JsonSerializable(explicitToJson: true)
class BlueCardApplicationInput extends JsonSerializable with EquatableMixin {
  BlueCardApplicationInput(
      {required this.applicationType,
      required this.entitlement,
      required this.givenInformationIsCorrectAndComplete,
      required this.hasAcceptedPrivacyPolicy,
      required this.personalData});

  factory BlueCardApplicationInput.fromJson(Map<String, dynamic> json) =>
      _$BlueCardApplicationInputFromJson(json);

  @JsonKey(unknownEnumValue: ApplicationType.artemisUnknown)
  late ApplicationType applicationType;

  late BlueCardEntitlementInput entitlement;

  late bool givenInformationIsCorrectAndComplete;

  late bool hasAcceptedPrivacyPolicy;

  late PersonalDataInput personalData;

  @override
  List<Object?> get props => [
        applicationType,
        entitlement,
        givenInformationIsCorrectAndComplete,
        hasAcceptedPrivacyPolicy,
        personalData
      ];
  @override
  Map<String, dynamic> toJson() => _$BlueCardApplicationInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class BlueCardEntitlementInput extends JsonSerializable with EquatableMixin {
  BlueCardEntitlementInput(
      {this.copyOfJuleica,
      required this.entitlementType,
      this.juleicaExpirationDate,
      this.juleicaNumber,
      this.serviceEntitlement,
      this.workAtOrganizations});

  factory BlueCardEntitlementInput.fromJson(Map<String, dynamic> json) =>
      _$BlueCardEntitlementInputFromJson(json);

  AttachmentInput? copyOfJuleica;

  @JsonKey(unknownEnumValue: BlueCardEntitlementType.artemisUnknown)
  late BlueCardEntitlementType entitlementType;

  String? juleicaExpirationDate;

  String? juleicaNumber;

  BlueCardServiceEntitlementInput? serviceEntitlement;

  List<WorkAtOrganizationInput>? workAtOrganizations;

  @override
  List<Object?> get props => [
        copyOfJuleica,
        entitlementType,
        juleicaExpirationDate,
        juleicaNumber,
        serviceEntitlement,
        workAtOrganizations
      ];
  @override
  Map<String, dynamic> toJson() => _$BlueCardEntitlementInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AttachmentInput extends JsonSerializable with EquatableMixin {
  AttachmentInput({required this.data, required this.fileName});

  factory AttachmentInput.fromJson(Map<String, dynamic> json) =>
      _$AttachmentInputFromJson(json);

  @JsonKey(
      fromJson: fromGraphQLUploadToDartMultipartFile,
      toJson: fromDartMultipartFileToGraphQLUpload)
  late MultipartFile data;

  late String fileName;

  @override
  List<Object?> get props => [data, fileName];
  @override
  Map<String, dynamic> toJson() => _$AttachmentInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class BlueCardServiceEntitlementInput extends JsonSerializable
    with EquatableMixin {
  BlueCardServiceEntitlementInput(
      {this.certificate, required this.organization, this.responsibility});

  factory BlueCardServiceEntitlementInput.fromJson(Map<String, dynamic> json) =>
      _$BlueCardServiceEntitlementInputFromJson(json);

  AttachmentInput? certificate;

  late OrganizationInput organization;

  String? responsibility;

  @override
  List<Object?> get props => [certificate, organization, responsibility];
  @override
  Map<String, dynamic> toJson() =>
      _$BlueCardServiceEntitlementInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class OrganizationInput extends JsonSerializable with EquatableMixin {
  OrganizationInput(
      {required this.address,
      required this.category,
      required this.contact,
      required this.name,
      this.website});

  factory OrganizationInput.fromJson(Map<String, dynamic> json) =>
      _$OrganizationInputFromJson(json);

  late AddressInput address;

  late String category;

  late OrganizationContactInput contact;

  late String name;

  String? website;

  @override
  List<Object?> get props => [address, category, contact, name, website];
  @override
  Map<String, dynamic> toJson() => _$OrganizationInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AddressInput extends JsonSerializable with EquatableMixin {
  AddressInput(
      {this.addressSupplement,
      required this.houseNumber,
      required this.location,
      required this.postalCode,
      required this.street});

  factory AddressInput.fromJson(Map<String, dynamic> json) =>
      _$AddressInputFromJson(json);

  String? addressSupplement;

  late String houseNumber;

  late String location;

  late String postalCode;

  late String street;

  @override
  List<Object?> get props =>
      [addressSupplement, houseNumber, location, postalCode, street];
  @override
  Map<String, dynamic> toJson() => _$AddressInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class OrganizationContactInput extends JsonSerializable with EquatableMixin {
  OrganizationContactInput(
      {required this.email,
      required this.hasGivenPermission,
      required this.name,
      required this.telephone});

  factory OrganizationContactInput.fromJson(Map<String, dynamic> json) =>
      _$OrganizationContactInputFromJson(json);

  late String email;

  late bool hasGivenPermission;

  late String name;

  late String telephone;

  @override
  List<Object?> get props => [email, hasGivenPermission, name, telephone];
  @override
  Map<String, dynamic> toJson() => _$OrganizationContactInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class WorkAtOrganizationInput extends JsonSerializable with EquatableMixin {
  WorkAtOrganizationInput(
      {required this.amountOfWork,
      required this.amountOfWorkUnit,
      this.certificate,
      required this.organization,
      required this.payment,
      required this.responsibility,
      required this.workSinceDate});

  factory WorkAtOrganizationInput.fromJson(Map<String, dynamic> json) =>
      _$WorkAtOrganizationInputFromJson(json);

  late double amountOfWork;

  @JsonKey(unknownEnumValue: AmountOfWorkUnit.artemisUnknown)
  late AmountOfWorkUnit amountOfWorkUnit;

  AttachmentInput? certificate;

  late OrganizationInput organization;

  late bool payment;

  late String responsibility;

  late String workSinceDate;

  @override
  List<Object?> get props => [
        amountOfWork,
        amountOfWorkUnit,
        certificate,
        organization,
        payment,
        responsibility,
        workSinceDate
      ];
  @override
  Map<String, dynamic> toJson() => _$WorkAtOrganizationInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class PersonalDataInput extends JsonSerializable with EquatableMixin {
  PersonalDataInput(
      {required this.address,
      required this.dateOfBirth,
      required this.emailAddress,
      required this.forenames,
      this.gender,
      this.nationality,
      required this.surname,
      this.telephone,
      this.title});

  factory PersonalDataInput.fromJson(Map<String, dynamic> json) =>
      _$PersonalDataInputFromJson(json);

  late AddressInput address;

  late String dateOfBirth;

  late String emailAddress;

  late String forenames;

  String? gender;

  String? nationality;

  late String surname;

  String? telephone;

  String? title;

  @override
  List<Object?> get props => [
        address,
        dateOfBirth,
        emailAddress,
        forenames,
        gender,
        nationality,
        surname,
        telephone,
        title
      ];
  @override
  Map<String, dynamic> toJson() => _$PersonalDataInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class AddGoldenEakApplication$Mutation extends JsonSerializable
    with EquatableMixin {
  AddGoldenEakApplication$Mutation();

  factory AddGoldenEakApplication$Mutation.fromJson(
          Map<String, dynamic> json) =>
      _$AddGoldenEakApplication$MutationFromJson(json);

  late bool addGoldenEakApplication;

  @override
  List<Object?> get props => [addGoldenEakApplication];
  @override
  Map<String, dynamic> toJson() =>
      _$AddGoldenEakApplication$MutationToJson(this);
}

@JsonSerializable(explicitToJson: true)
class GoldenEakCardApplicationInput extends JsonSerializable
    with EquatableMixin {
  GoldenEakCardApplicationInput(
      {required this.entitlement,
      required this.givenInformationIsCorrectAndComplete,
      required this.hasAcceptedPrivacyPolicy,
      required this.personalData});

  factory GoldenEakCardApplicationInput.fromJson(Map<String, dynamic> json) =>
      _$GoldenEakCardApplicationInputFromJson(json);

  late GoldenCardEntitlementInput entitlement;

  late bool givenInformationIsCorrectAndComplete;

  late bool hasAcceptedPrivacyPolicy;

  late PersonalDataInput personalData;

  @override
  List<Object?> get props => [
        entitlement,
        givenInformationIsCorrectAndComplete,
        hasAcceptedPrivacyPolicy,
        personalData
      ];
  @override
  Map<String, dynamic> toJson() => _$GoldenEakCardApplicationInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class GoldenCardEntitlementInput extends JsonSerializable with EquatableMixin {
  GoldenCardEntitlementInput(
      {this.certificate,
      required this.goldenEntitlementType,
      this.workAtOrganizations});

  factory GoldenCardEntitlementInput.fromJson(Map<String, dynamic> json) =>
      _$GoldenCardEntitlementInputFromJson(json);

  AttachmentInput? certificate;

  @JsonKey(unknownEnumValue: GoldenCardEntitlementType.artemisUnknown)
  late GoldenCardEntitlementType goldenEntitlementType;

  List<WorkAtOrganizationInput>? workAtOrganizations;

  @override
  List<Object?> get props =>
      [certificate, goldenEntitlementType, workAtOrganizations];
  @override
  Map<String, dynamic> toJson() => _$GoldenCardEntitlementInputToJson(this);
}

@JsonSerializable(explicitToJson: true)
class CardVerificationByHash$Query extends JsonSerializable
    with EquatableMixin {
  CardVerificationByHash$Query();

  factory CardVerificationByHash$Query.fromJson(Map<String, dynamic> json) =>
      _$CardVerificationByHash$QueryFromJson(json);

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

enum ApplicationType {
  @JsonValue('FIRST_APPLICATION')
  firstApplication,
  @JsonValue('RENEWAL_APPLICATION')
  renewalApplication,
  @JsonValue('ARTEMIS_UNKNOWN')
  artemisUnknown,
}
enum BlueCardEntitlementType {
  @JsonValue('JULEICA')
  juleica,
  @JsonValue('SERVICE')
  service,
  @JsonValue('STANDARD')
  standard,
  @JsonValue('ARTEMIS_UNKNOWN')
  artemisUnknown,
}
enum AmountOfWorkUnit {
  @JsonValue('HOURS_PER_WEEK')
  hoursPerWeek,
  @JsonValue('HOURS_PER_YEAR')
  hoursPerYear,
  @JsonValue('ARTEMIS_UNKNOWN')
  artemisUnknown,
}
enum GoldenCardEntitlementType {
  @JsonValue('HONOR_BY_MINISTER_PRESIDENT')
  honorByMinisterPresident,
  @JsonValue('SERVICE_AWARD')
  serviceAward,
  @JsonValue('STANDARD')
  standard,
  @JsonValue('ARTEMIS_UNKNOWN')
  artemisUnknown,
}

@JsonSerializable(explicitToJson: true)
class GetRegionsByIdArguments extends JsonSerializable with EquatableMixin {
  GetRegionsByIdArguments({required this.ids});

  @override
  factory GetRegionsByIdArguments.fromJson(Map<String, dynamic> json) =>
      _$GetRegionsByIdArgumentsFromJson(json);

  late IdsParamsInput ids;

  @override
  List<Object?> get props => [ids];
  @override
  Map<String, dynamic> toJson() => _$GetRegionsByIdArgumentsToJson(this);
}

final GET_REGIONS_BY_ID_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'getRegionsById'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'ids')),
            type: NamedTypeNode(
                name: NameNode(value: 'IdsParamsInput'), isNonNull: true),
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
  final String operationName = 'getRegionsById';

  @override
  final GetRegionsByIdArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  GetRegionsById$Query parse(Map<String, dynamic> json) =>
      GetRegionsById$Query.fromJson(json);
}

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
  final String operationName = 'getRegions';

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
  final String operationName = 'AcceptingStoresSearch';

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

  late IdsParamsInput ids;

  @override
  List<Object?> get props => [ids];
  @override
  Map<String, dynamic> toJson() => _$AcceptingStoreByIdArgumentsToJson(this);
}

final ACCEPTING_STORE_BY_ID_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'AcceptingStoreById'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'ids')),
            type: NamedTypeNode(
                name: NameNode(value: 'IdsParamsInput'), isNonNull: true),
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
  final String operationName = 'AcceptingStoreById';

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

  late IdsParamsInput ids;

  @override
  List<Object?> get props => [ids];
  @override
  Map<String, dynamic> toJson() =>
      _$AcceptingStoreSummaryByIdArgumentsToJson(this);
}

final ACCEPTING_STORE_SUMMARY_BY_ID_QUERY_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.query,
      name: NameNode(value: 'AcceptingStoreSummaryById'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'ids')),
            type: NamedTypeNode(
                name: NameNode(value: 'IdsParamsInput'), isNonNull: true),
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
  final String operationName = 'AcceptingStoreSummaryById';

  @override
  final AcceptingStoreSummaryByIdArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  AcceptingStoreSummaryById$Query parse(Map<String, dynamic> json) =>
      AcceptingStoreSummaryById$Query.fromJson(json);
}

@JsonSerializable(explicitToJson: true)
class AddBlueEakApplicationArguments extends JsonSerializable
    with EquatableMixin {
  AddBlueEakApplicationArguments(
      {required this.application, required this.regionId});

  @override
  factory AddBlueEakApplicationArguments.fromJson(Map<String, dynamic> json) =>
      _$AddBlueEakApplicationArgumentsFromJson(json);

  late BlueCardApplicationInput application;

  late int regionId;

  @override
  List<Object?> get props => [application, regionId];
  @override
  Map<String, dynamic> toJson() => _$AddBlueEakApplicationArgumentsToJson(this);
}

final ADD_BLUE_EAK_APPLICATION_MUTATION_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.mutation,
      name: NameNode(value: 'AddBlueEakApplication'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'application')),
            type: NamedTypeNode(
                name: NameNode(value: 'BlueCardApplicationInput'),
                isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: []),
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'regionId')),
            type: NamedTypeNode(name: NameNode(value: 'Int'), isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: [])
      ],
      directives: [],
      selectionSet: SelectionSetNode(selections: [
        FieldNode(
            name: NameNode(value: 'addBlueEakApplication'),
            alias: null,
            arguments: [
              ArgumentNode(
                  name: NameNode(value: 'application'),
                  value: VariableNode(name: NameNode(value: 'application'))),
              ArgumentNode(
                  name: NameNode(value: 'regionId'),
                  value: VariableNode(name: NameNode(value: 'regionId')))
            ],
            directives: [],
            selectionSet: null)
      ]))
]);

class AddBlueEakApplicationMutation extends GraphQLQuery<
    AddBlueEakApplication$Mutation, AddBlueEakApplicationArguments> {
  AddBlueEakApplicationMutation({required this.variables});

  @override
  final DocumentNode document = ADD_BLUE_EAK_APPLICATION_MUTATION_DOCUMENT;

  @override
  final String operationName = 'AddBlueEakApplication';

  @override
  final AddBlueEakApplicationArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  AddBlueEakApplication$Mutation parse(Map<String, dynamic> json) =>
      AddBlueEakApplication$Mutation.fromJson(json);
}

@JsonSerializable(explicitToJson: true)
class AddGoldenEakApplicationArguments extends JsonSerializable
    with EquatableMixin {
  AddGoldenEakApplicationArguments(
      {required this.application, required this.regionId});

  @override
  factory AddGoldenEakApplicationArguments.fromJson(
          Map<String, dynamic> json) =>
      _$AddGoldenEakApplicationArgumentsFromJson(json);

  late GoldenEakCardApplicationInput application;

  late int regionId;

  @override
  List<Object?> get props => [application, regionId];
  @override
  Map<String, dynamic> toJson() =>
      _$AddGoldenEakApplicationArgumentsToJson(this);
}

final ADD_GOLDEN_EAK_APPLICATION_MUTATION_DOCUMENT = DocumentNode(definitions: [
  OperationDefinitionNode(
      type: OperationType.mutation,
      name: NameNode(value: 'AddGoldenEakApplication'),
      variableDefinitions: [
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'application')),
            type: NamedTypeNode(
                name: NameNode(value: 'GoldenEakCardApplicationInput'),
                isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: []),
        VariableDefinitionNode(
            variable: VariableNode(name: NameNode(value: 'regionId')),
            type: NamedTypeNode(name: NameNode(value: 'Int'), isNonNull: true),
            defaultValue: DefaultValueNode(value: null),
            directives: [])
      ],
      directives: [],
      selectionSet: SelectionSetNode(selections: [
        FieldNode(
            name: NameNode(value: 'addGoldenEakApplication'),
            alias: null,
            arguments: [
              ArgumentNode(
                  name: NameNode(value: 'application'),
                  value: VariableNode(name: NameNode(value: 'application'))),
              ArgumentNode(
                  name: NameNode(value: 'regionId'),
                  value: VariableNode(name: NameNode(value: 'regionId')))
            ],
            directives: [],
            selectionSet: null)
      ]))
]);

class AddGoldenEakApplicationMutation extends GraphQLQuery<
    AddGoldenEakApplication$Mutation, AddGoldenEakApplicationArguments> {
  AddGoldenEakApplicationMutation({required this.variables});

  @override
  final DocumentNode document = ADD_GOLDEN_EAK_APPLICATION_MUTATION_DOCUMENT;

  @override
  final String operationName = 'AddGoldenEakApplication';

  @override
  final AddGoldenEakApplicationArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  AddGoldenEakApplication$Mutation parse(Map<String, dynamic> json) =>
      AddGoldenEakApplication$Mutation.fromJson(json);
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
  final String operationName = 'CardVerificationByHash';

  @override
  final CardVerificationByHashArguments variables;

  @override
  List<Object?> get props => [document, operationName, variables];
  @override
  CardVerificationByHash$Query parse(Map<String, dynamic> json) =>
      CardVerificationByHash$Query.fromJson(json);
}
