import 'package:ehrenamtskarte/util/l10n.dart';
import 'package:flutter/material.dart';

const test = Color(0xff5f5384);

@immutable
class CategoryAsset {
  const CategoryAsset({
    required this.id,
    required this.name,
    required this.shortName,
    required this.icon,
    required this.detailIcon,
    required this.color,
  });

  final int id;
  final String name;
  final String shortName;
  final String icon;
  final String? detailIcon;
  final Color? color;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is CategoryAsset && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}

List<CategoryAsset> categoryAssets(BuildContext context) {
  return [
    CategoryAsset(
      id: 0,
      name: context.l10n.category_mobilityLong,
      shortName: context.l10n.category_mobility,
      icon: 'assets/category_icons/0.svg',
      detailIcon: 'assets/detail_headers/0_auto.svg',
      color: Color(0xffE89600),
    ),
    CategoryAsset(
      id: 1,
      name: context.l10n.category_media,
      shortName: context.l10n.category_media,
      icon: 'assets/category_icons/1.svg',
      detailIcon: 'assets/detail_headers/1_multimedia.svg',
      color: Color(0xFFFA0000),
    ),
    CategoryAsset(
      id: 2,
      name: context.l10n.category_healthLong,
      shortName: context.l10n.category_health,
      icon: 'assets/category_icons/2.svg',
      detailIcon: 'assets/detail_headers/2_sport.svg',
      color: Color(0xFFE500D3),
    ),
    CategoryAsset(
      id: 3,
      name: context.l10n.category_cultureLong,
      shortName: context.l10n.category_culture,
      icon: 'assets/category_icons/3.svg',
      detailIcon: 'assets/detail_headers/3_kultur.svg',
      color: Color(0xFF7500EB),
    ),
    CategoryAsset(
      id: 4,
      name: context.l10n.category_servicesLong,
      shortName: context.l10n.category_services,
      icon: 'assets/category_icons/4.svg',
      detailIcon: 'assets/detail_headers/4_finanzen.svg',
      color: Color(0xFF515151),
    ),
    CategoryAsset(
      id: 5,
      name: context.l10n.category_fashionLong,
      shortName: context.l10n.category_fashion,
      icon: 'assets/category_icons/5.svg',
      detailIcon: 'assets/detail_headers/5_mode.svg',
      color: Color(0xFF6EBE00),
    ),
    CategoryAsset(
      id: 6,
      name: context.l10n.category_livingLong,
      shortName: context.l10n.category_living,
      icon: 'assets/category_icons/6.svg',
      detailIcon: 'assets/detail_headers/6_haus.svg',
      color: Color(0xFF00D0C7),
    ),
    CategoryAsset(
      id: 7,
      name: context.l10n.category_leisureLong,
      shortName: context.l10n.category_leisure,
      icon: 'assets/category_icons/7.svg',
      detailIcon: 'assets/detail_headers/7_freizeit.svg',
      color: Color(0xFF007CE8),
    ),
    CategoryAsset(
      id: 8,
      name: context.l10n.category_foodLong,
      shortName: context.l10n.category_food,
      icon: 'assets/category_icons/8.svg',
      detailIcon: 'assets/detail_headers/8_essen.svg',
      color: Color(0xFF197489),
    ),
    CategoryAsset(
      id: 9,
      name: context.l10n.category_other,
      shortName: context.l10n.category_other,
      icon: 'assets/category_icons/9.svg',
      detailIcon: null,
      color: Color(0xFFc51162),
    ),
    CategoryAsset(
      id: 10,
      name: context.l10n.category_lunchTables,
      shortName: context.l10n.category_lunchTables,
      icon: 'assets/category_icons/10.svg',
      detailIcon: 'assets/detail_headers/10_mittagstische.svg',
      color: Color(0xFF197489),
    ),
    CategoryAsset(
      id: 11,
      name: context.l10n.category_clothingLong,
      shortName: context.l10n.category_clothing,
      icon: 'assets/category_icons/11.svg',
      detailIcon: 'assets/detail_headers/11_kleidung.svg',
      color: Color(0xFF6EBE00),
    ),
    CategoryAsset(
      id: 12,
      name: context.l10n.category_cultureLongAlternative,
      shortName: context.l10n.category_culture,
      icon: 'assets/category_icons/12.svg',
      detailIcon: 'assets/detail_headers/12_kultur.svg',
      color: Color(0xFF7500EB),
    ),
    CategoryAsset(
      id: 13,
      name: context.l10n.category_education,
      shortName: context.l10n.category_education,
      icon: 'assets/category_icons/13.svg',
      detailIcon: null,
      color: Color(0xFFd100cc),
    ),
    CategoryAsset(
      id: 14,
      name: context.l10n.category_moviesLong,
      shortName: context.l10n.category_movies,
      icon: 'assets/category_icons/14.svg',
      detailIcon: null,
      color: Color(0xFFc51162),
    ),
    CategoryAsset(
      id: 15,
      name: context.l10n.category_pharmaciesLong,
      shortName: context.l10n.category_pharmacies,
      icon: 'assets/category_icons/15.svg',
      detailIcon: null,
      color: Color(0xFF007be0),
    ),
    CategoryAsset(
      id: 16,
      name: context.l10n.category_digitalParticipation,
      shortName: context.l10n.category_digitalParticipation,
      icon: 'assets/category_icons/16.svg',
      detailIcon: 'assets/detail_headers/16_teilhabe.svg',
      color: Color(0xFFFA0000),
    ),
    CategoryAsset(
      id: 17,
      name: context.l10n.category_sports,
      shortName: context.l10n.category_sports,
      icon: 'assets/category_icons/17.svg',
      detailIcon: 'assets/detail_headers/17_sport.svg',
      color: Color(0xFF00ccc6),
    ),
    CategoryAsset(
      id: 18,
      name: context.l10n.category_mobility,
      shortName: context.l10n.category_mobility,
      icon: 'assets/category_icons/18.svg',
      detailIcon: 'assets/detail_headers/18_mobilitaet.svg',
      color: Color(0xffE89600),
    ),
  ];
}
