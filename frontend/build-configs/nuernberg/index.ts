import { ACTIVATION_PATH, NUERNBERG_PRODUCTION_ID, NUERNBERG_STAGING_ID } from "../constants"
import BuildConfigType, { CommonBuildConfigType } from "../types"
import disclaimerText from "./disclaimerText"
import publisherText from "./publisherText"

const ANDROID_APPLICATION_ID = "app.entitlementcard.nuernberg"
const IOS_BUNDLE_IDENTIFIER = "app.sozialpass.nuernberg"

export const nuernbergCommon: CommonBuildConfigType = {
    appName: "Nürnberg-Pass",
    appIcon: "app_icon_nuernberg",
    projectId: {
        production: NUERNBERG_PRODUCTION_ID,
        showcase: "showcase.entitlementcard.app",
        local: NUERNBERG_PRODUCTION_ID,
        staging: NUERNBERG_STAGING_ID,
    },
    categories: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    theme: {
        primaryLight: "#D88C51",
        primaryDark: "#F9B787",
        fontFamily: "Roboto",
    },
    mapStyleUrl: {
        production: "https://api.entitlementcard.app/project/nuernberg.sozialpass.app/map",
        staging: "https://api.staging.entitlementcard.app/project/nuernberg.sozialpass.app/map",
        showcase: "https://api.entitlementcard.app/project/showcase.entitlementcard.app/map",
        local: "http://localhost:8000/project/nuernberg.sozialpass.app/map",
    },
    mapInitialCoordinatesLat: 49.460983,
    mapInitialCoordinatesLng: 11.061859,
    mapInitialZoomLevel: 10,
    backendUrl: {
        production: "https://api.entitlementcard.app",
        staging: "https://api.staging.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
        local: "http://localhost:8000",
    },
    appLocales: ["de", "en"],
    localeOverridePath: "assets/nuernberg/l10n",
    cardBranding: {
        headerTextColor: "#000000",
        headerTextFontSize: 9,
        headerColor: "#F9B787",
        headerTitleLeft: "Amt für Existenzsicherung\nund soziale Integration -\nSozialamt",
        headerTitleRight: "",
        headerLogo: "assets/nuernberg/header-logo.png",
        headerLogoPadding: 0,
        headerLogoWidth: 60,
        headerContainerPadding: { top: 0, right: 24, bottom: 0, left: 16 },
        bodyContainerPadding: { top: 0, right: 24, bottom: 6, left: 16 },
        bodyLogo: "assets/nuernberg/body-logo.png",
        bodyLogoPosition: "right",
        bodyLogoWidth: 60,
        bodyLabel: "Nürnberg-Pass",
        bodyTextColor: "#000000",
        bodyBackgroundImage: true,
        bodyBackgroundImageUrl: "assets/nuernberg/background.png",
        colorStandard: "#F9B787",
        colorPremium: "#F9B787",
        boxDecorationRadius: 0,
    },
    iconInAboutTab: "assets/nuernberg/body-logo.png",
    introSlidesImages: [
        "assets/nuernberg/body-logo.png",
        "assets/nuernberg/intro_slides/apply_for_sozialpass.png",
        "assets/nuernberg/intro_slides/map_zoom.png",
        "assets/nuernberg/intro_slides/search_with_location.png",
    ],
    featureFlags: {
        verification: true,
        favorites: false,
    },
    applicationUrl: "https://beantragen.nuernberg.sozialpass.app",
    publisherAddress:
        "Stadt Nürnberg\nAmt für Existenzsicherung\nund soziale Integration - Sozialamt\nDietzstraße 4\n90443 Nürnberg",
    dataPrivacyPolicyUrl: "https://nuernberg.sozialpass.app/data-privacy-policy",
    publisherText,
    disclaimerText,
    maxCardAmount: 5,
    activationPath: ACTIVATION_PATH,
    deepLinking: {
        projectName: "nuernberg",
        customScheme: "nuernbergpass",
        android: {
            applicationId: ANDROID_APPLICATION_ID,
            path: `/${ACTIVATION_PATH}/.*`,
            sha256CertFingerprint:
                "BC:46:1D:87:A8:DC:3F:39:0E:68:D6:4A:D7:39:43:BD:24:98:5B:76:D6:7E:96:2E:C2:03:AE:E3:35:42:3D:2D",
        },
        ios: {
            appleAppSiteAssociationAppId: `7272KE28TJ.${IOS_BUNDLE_IDENTIFIER}`,
            path: `/${ACTIVATION_PATH}/*`,
            pathComment: `Matches any URL with a path that starts with /${ACTIVATION_PATH}/.`,
        },
    },
}

const nuernberg: BuildConfigType = {
    common: nuernbergCommon,
    android: {
        ...nuernbergCommon,
        applicationId: ANDROID_APPLICATION_ID,
        buildFeatures: {
            excludeLocationPlayServices: false,
            excludeX86: false,
        },
        appStoreLink: `https://play.google.com/store/apps/details?id=${ANDROID_APPLICATION_ID}`,
    },
    ios: {
        ...nuernbergCommon,
        bundleIdentifier: IOS_BUNDLE_IDENTIFIER,
        provisioningProfileSpecifier: "match AppStore app.sozialpass.nuernberg",
        appStoreLink: "https://apps.apple.com/de/app/n%C3%BCrnberg-pass/id1667599309",
    },
}

export default nuernberg
