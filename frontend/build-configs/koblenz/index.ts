import { ACTIVATION_PATH, KOBLENZ_PRODUCTION_ID, KOBLENZ_STAGING_ID } from "../constants"
import BuildConfigType, { CommonBuildConfigType } from "../types"
import disclaimerText from "./disclaimerText"
import publisherText from "./publisherText"

const ANDROID_APPLICATION_ID = "app.sozialpass.koblenz"
const IOS_BUNDLE_IDENTIFIER = "app.sozialpass.koblenz"
const APP_NAME = "KoblenzPass"

export const koblenzCommon: CommonBuildConfigType = {
    appName: APP_NAME,
    appIcon: "app_icon_koblenz",
    projectId: {
        production: KOBLENZ_PRODUCTION_ID,
        showcase: "showcase.entitlementcard.app",
        local: KOBLENZ_PRODUCTION_ID,
        staging: KOBLENZ_STAGING_ID,
    },
    categories: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    theme: {
        primaryLight: "#8377A9",
        primaryDark: "#8377A9",
        fontFamily: "TexGyreHeroes",
    },
    mapStyleUrl: {
        production: "https://api.entitlementcard.app/project/koblenz.sozialpass.app/map",
        staging: "https://api.staging.entitlementcard.app/project/koblenz.sozialpass.app/map",
        showcase: "https://api.entitlementcard.app/project/showcase.entitlementcard.app/map",
        local: "http://localhost:8000/project/koblenz.sozialpass.app/map",
    },
    mapInitialCoordinatesLat: 50.3575886,
    mapInitialCoordinatesLng: 7.5846829,
    mapInitialZoomLevel: 10,
    backendUrl: {
        production: "https://api.entitlementcard.app",
        staging: "https://api.staging.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
        local: "http://localhost:8000",
    },
    appLocales: ["de"],
    localeOverridePath: "assets/koblenz/l10n",
    cardBranding: {
        headerTextColor: "#c4262e",
        headerColor: "#b1b3b4",
        headerTitleLeft: "",
        headerTitleRight: APP_NAME,
        headerTextFontSize: 8,
        headerLogo: "assets/koblenz/header-logo.png",
        headerLogoPadding: 4,
        headerLogoWidth: 60,
        headerContainerPadding: { top: 0, right: 4, bottom: 0, left: 8 },
        bodyContainerPadding: { top: 8, right: 8, bottom: 8, left: 8 },
        bodyLogo: "assets/koblenz/body-logo.png",
        bodyLogoPosition: "center",
        bodyLogoWidth: 125,
        bodyLabel: APP_NAME,
        bodyTextColor: "#97233f",
        bodyBackgroundImage: true,
        bodyBackgroundImageUrl: "assets/koblenz/background.png",
        colorStandard: "#d10074",
        colorPremium: "#d10074",
        boxDecorationRadius: 1,
    },
    iconInAboutTab: "assets/koblenz/icon.png",
    introSlidesImages: [
        "assets/koblenz/icon.png",
        "assets/koblenz/intro_slides/apply_for_sozialpass.png",
        "assets/koblenz/intro_slides/map_zoom.png",
        "assets/koblenz/intro_slides/search_with_location.png",
    ],
    featureFlags: {
        verification: true,
        favorites: false,
    },
    applicationUrl: "https://beantragen.koblenz.sozialpass.app",
    dataPrivacyPolicyUrl: "https://koblenz.sozialpass.app/data-privacy-policy",
    publisherAddress: "Stadt Koblenz\nWilli-Hörter-Platz 1\n56068 Koblenz",
    publisherText,
    disclaimerText,
    maxCardAmount: 1,
    activationPath: ACTIVATION_PATH,
    deepLinking: {
        projectName: "koblenz",
        customScheme: "koblenzpass",
        android: {
            applicationId: ANDROID_APPLICATION_ID,
            path: `/${ACTIVATION_PATH}/.*`,
            sha256CertFingerprint:
                "87:56:79:B8:71:5C:50:D4:25:7D:40:62:BD:45:B4:B5:F7:15:1B:E6:65:1B:82:6D:35:BE:BC:57:87:8A:CA:7A",
        },
        ios: {
            appleAppSiteAssociationAppId: `7272KE28TJ.${IOS_BUNDLE_IDENTIFIER}`,
            path: `/${ACTIVATION_PATH}/*`,
            pathComment: `Matches any URL with a path that starts with /${ACTIVATION_PATH}/.`,
        },
    },
}

const koblenz: BuildConfigType = {
    common: koblenzCommon,
    android: {
        ...koblenzCommon,
        applicationId: ANDROID_APPLICATION_ID,
        buildFeatures: {
            excludeLocationPlayServices: false,
            excludeX86: false,
        },
        appStoreLink: `https://play.google.com/store/apps/details?id=${ANDROID_APPLICATION_ID}`
    },
    ios: {
        ...koblenzCommon,
        bundleIdentifier: IOS_BUNDLE_IDENTIFIER,
        provisioningProfileSpecifier: "match AppStore app.sozialpass.koblenz",
        appStoreLink: "https://apps.apple.com/de/app/koblenzpass/id6670392532"
    },
}

export default koblenz
