import { ACTIVATION_PATH, BAYERN_PRODUCTION_ID, BAYERN_STAGING_ID } from "../constants"
import BuildConfigType, { CommonBuildConfigType } from "../types"
import disclaimerText from "./disclaimerText"
import publisherText from "./publisherText"

const ANDROID_APPLICATION_ID = "de.nrw.it.giz.ehrensache.bayern.android"
const IOS_BUNDLE_IDENTIFIER = "de.nrw.it.ehrensachebayern"

export const bayernCommon: CommonBuildConfigType = {
    appName: "Ehrenamt",
    appIcon: "app_icon_bayern",
    projectId: {
        production: BAYERN_PRODUCTION_ID,
        showcase: "showcase.entitlementcard.app",
        local: BAYERN_PRODUCTION_ID,
        staging: BAYERN_STAGING_ID,
    },
    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    theme: {
        primaryLight: "#8377A9",
        primaryDark: "#8377A9",
        fontFamily: "Roboto",
    },
    mapStyleUrl: {
        production: "https://api.entitlementcard.app/project/bayern.ehrenamtskarte.app/map",
        staging: "https://api.staging.entitlementcard.app/project/bayern.ehrenamtskarte.app/map",
        showcase: "https://api.entitlementcard.app/project/showcase.entitlementcard.app/map",
        local: "http://localhost:8000/project/bayern.ehrenamtskarte.app/map",
    },
    mapInitialCoordinatesLat: 48.949444,
    mapInitialCoordinatesLng: 11.395,
    mapInitialZoomLevel: 6,
    backendUrl: {
        production: "https://api.entitlementcard.app",
        staging: "https://api.staging.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
        local: "http://localhost:8000",
    },
    appLocales: ["de"],
    localeOverridePath: null,
    cardBranding: {
        headerTextColor: "#008dc9",
        headerColor: "#F5F5FFF5",
        headerTitleLeft: "",
        headerTitleRight: "Freistaat Bayern",
        headerTextFontSize: 8,
        headerLogo: "assets/bayern/header-logo.png",
        headerLogoPadding: 4,
        headerLogoWidth: 60,
        headerContainerPadding: { top: 0, right: 4, bottom: 0, left: 8 },
        bodyContainerPadding: { top: 8, right: 8, bottom: 8, left: 8 },
        bodyLogo: "assets/bayern/body-logo.png",
        bodyLogoPosition: "center",
        bodyLogoWidth: 125,
        bodyLabel: "Bayerische Ehrenamtskarte",
        bodyTextColor: "#172c82",
        bodyBackgroundImage: false,
        bodyBackgroundImageUrl: "",
        colorStandard: "#cfeaff",
        colorPremium: "#cab374",
        boxDecorationRadius: 1,
    },
    iconInAboutTab: "assets/bayern/icon.png",
    introSlidesImages: [
        "assets/bayern/icon.png",
        "assets/bayern/intro_slides/apply_for_eak.png",
        "assets/bayern/intro_slides/map_zoom.jpeg",
        "assets/bayern/intro_slides/search_with_location.png",
    ],
    featureFlags: {
        verification: true,
        favorites: false,
    },
    applicationUrl: "https://bayern.ehrenamtskarte.app/beantragen",
    dataPrivacyPolicyUrl: "https://bayern.ehrenamtskarte.app/data-privacy-policy",
    publisherAddress:
        "Bayerisches Staatsministerium\nfür Familie, Arbeit und Soziales\nWinzererstraße 9\n80797 München",
    publisherText,
    disclaimerText,
    maxCardAmount: 1,
    activationPath: ACTIVATION_PATH,
    deepLinking: {
        projectName: "bayern",
        customScheme: "ehrenamtbayern",
        android: {
            applicationId: ANDROID_APPLICATION_ID,
            path: `/${ACTIVATION_PATH}/.*`,
            sha256CertFingerprint:
                "9D:BE:FB:95:02:09:90:B6:8D:4E:06:BA:8A:35:8C:8A:AD:53:4E:98:60:DA:F3:07:B1:3F:E2:8A:24:5D:B2:8B",
        },
        ios: {
            appleAppSiteAssociationAppId: `7272KE28TJ.${IOS_BUNDLE_IDENTIFIER}`,
            path: `/${ACTIVATION_PATH}/*`,
            pathComment: `Matches any URL with a path that starts with /${ACTIVATION_PATH}/.`,
        },
    },
}

const bayern: BuildConfigType = {
    common: bayernCommon,
    android: {
        ...bayernCommon,
        applicationId: ANDROID_APPLICATION_ID,
        buildFeatures: {
            excludeLocationPlayServices: false,
            excludeX86: false,
        },
        appStoreLink: `https://play.google.com/store/apps/details?id=${ANDROID_APPLICATION_ID}`,
    },
    ios: {
        ...bayernCommon,
        bundleIdentifier: IOS_BUNDLE_IDENTIFIER,
        provisioningProfileSpecifier: "match AppStore de.nrw.it.ehrensachebayern",
        appStoreLink: "https://apps.apple.com/de/app/ehrenamtskarte-bayern/id1261285110",
    },
}

export default bayern
