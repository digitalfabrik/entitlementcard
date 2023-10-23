import BuildConfigType, {CommonBuildConfigType} from "../types"
import publisherText from "./publisherText"
import disclaimerText from "./disclaimerText"
import localization from "./localization"

export const bayernCommon: CommonBuildConfigType = {
    appName: "Ehrenamt",
    appIcon: "app_icon_bayern",
    projectId: {
        production: "bayern.ehrenamtskarte.app",
        showcase: "showcase.entitlementcard.app",
        local: "bayern.ehrenamtskarte.app",
    },
    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    theme: {
        primaryLight: "#8377A9",
        primaryDark: "#8377A9",
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
    appLocales: ['de'],
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
    introSlide1: {
        title: "Willkommen!",
        description: "Vielen Dank, dass Sie sich die App zur " +
            "Bayerischen Ehrenamtskarte heruntergeladen haben!",
        imagePath: "assets/bayern/icon.png"
    },
    introSlide2: {
        title: "Wie kann ich die Ehrenamtskarte beantragen?",
        description: "Im Formular geben Sie Informationen über sich und Ihre " +
            "ehrenamtliche Tätigkeit an.\nAnschließend wird " +
            "der Antrag weitergeleitet und von der zuständigen Stelle bearbeitet.",
        imagePath: "assets/bayern/intro_slides/apply_for_eak.png"
    },
    introSlide3: {
        title: "Wo kann ich meine Ehrenamtskarte nutzen?",
        description: "Auf der Karte von Bayern können Sie alle Akzeptanzstellen" +
            " finden.\nTippen Sie auf einen Standort, um mehr Informationen " +
            "sehen zu können.",
        imagePath: "assets/bayern/intro_slides/map_zoom.jpeg"
    },
    introSlide4: {
        title: "Finden Sie Akzeptanzstellen in Ihrer Umgebung!",
        description: "Wir können Ihren Standort auf der Karte anzeigen" +
            " und Akzeptanzstellen in Ihrer Umgebung anzeigen.\n" +
            "Wenn Sie diese Hilfen nutzen möchten, benötigen wir Ihre " +
            "Zustimmung.\nIhr Standort wird nicht gespeichert.",
        imagePath: "assets/bayern/intro_slides/search_with_location.png"
    },
    featureFlags: {
        verification: true
    },
    applicationUrl: "https://bayern.ehrenamtskarte.app/beantragen",
    dataPrivacyPolicyUrl: "https://bayern.ehrenamtskarte.app/data-privacy-policy",
    publisherAddress:
        "Bayerisches Staatsministerium\nfür Familie, Arbeit und Soziales\nWinzererstraße 9\n80797 München",
    publisherText,
    disclaimerText,
    localization,
    maxCardAmount: 1
}

let bayern: BuildConfigType = {
    common: bayernCommon,
    android: {
        ...bayernCommon,
        applicationId: "de.nrw.it.giz.ehrensache.bayern.android",
        featureFlags: {
            ...bayernCommon.featureFlags,
            excludeLocationPlayServices: false,
            excludeX86: false,
        },
    },
    ios: {
        ...bayernCommon,
        bundleIdentifier: "de.nrw.it.ehrensachebayern",
    },
}

export default bayern
