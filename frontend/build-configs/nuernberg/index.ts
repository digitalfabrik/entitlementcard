import BuildConfigType, { CommonBuildConfigType } from "../types";
import publisherText from "./publisherText";
import disclaimerText from "./disclaimerText";

export const nuernbergCommon: CommonBuildConfigType = {
    appName: "Nürnberg-Pass",
    appIcon: "app_icon_nuernberg",
    projectId: {
        production: "nuernberg.sozialpass.app",
        showcase: "showcase.entitlementcard.app",
        local: "nuernberg.sozialpass.app"
    },
    categories: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    theme: {
        primaryLight: "#D88C51",
        primaryDark: "#F9B787"
    },
    mapStyleUrl: {
        production: "https://api.entitlementcard.app/project/nuernberg.sozialpass.app/map",
        showcase: "https://api.entitlementcard.app/project/showcase.entitlementcard.app/map",
        local: "http://localhost:8000/project/nuernberg.sozialpass.app/map",
    },
    mapInitialCoordinatesLat: 49.460983,
    mapInitialCoordinatesLng: 11.061859,
    mapInitialZoomLevel: 10,
    backendUrl: {
        production: "https://api.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
        local: "http://localhost:8000",
    },
    cardBranding: {
        headerTextColor: "#000000",
        headerTextFontSize: 9,
        headerColor: "#F9B787",
        headerTitleLeft: "Amt für Existenzsicherung und soziale Integration - Sozialamt",
        headerTitleRight: "",
        headerLogo: "assets/nuernberg/header-logo.png",
        headerLogoPadding: 0,
        headerLogoWidth: 60,
        headerContainerPadding: {top: 0, right: 24, bottom: 0, left: 16},
        bodyContainerPadding: {top: 0, right: 24, bottom: 24, left: 16},
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
    featureFlags: {},
    applicationUrl: "https://beantragen.nuernberg.sozialpass.app",
    publisherAddress: "Stadt Nürnberg\nAmt für Existenzsicherung\nund soziale Integration\nDietzstraße 4\n90443 Nürnberg",
    dataPrivacyPolicyUrl: "https://nuernberg.sozialpass.app/data-privacy-policy",
    publisherText: publisherText,
    disclaimerText: disclaimerText,
};

let nuernberg: BuildConfigType = {
    common: nuernbergCommon,
    android: {
        ...nuernbergCommon,
        applicationId: "app.entitlementcard.nuernberg",
        featureFlags: {
            ...nuernbergCommon.featureFlags,
            excludeLocationPlayServices: false,
            excludeX86: false
        }
    },
    ios: {
        ...nuernbergCommon,
        bundleIdentifier: "de.nrw.it.ehrensachebayern"
    }
};

export default nuernberg
