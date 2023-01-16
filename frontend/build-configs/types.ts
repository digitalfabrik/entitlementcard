type BuildConfigType = {
    common: CommonBuildConfigType
    android: AndroidBuildConfigType,
    ios: iOSBuildConfigType,
}

export type FeatureFlagsType = {}

export type ThemeType = {
    primaryLight: string,
    primaryDark: string
}

export type CommonBuildConfigType = {
    appName: string
    appIcon: string
    projectId: {
        showcase: string,
        production: string,
        local: string,
    },
    mapStyleUrl: {
        showcase: string,
        production: string,
        local: string,
    },
    mapInitialCoordinatesLat: number
    mapInitialCoordinatesLng: number
    mapInitialZoomLevel: number
    backendUrl: {
        showcase: string,
        production: string,
        local: string,
    },
    cardBranding: {
        headerTextColor: string,
        headerColor: string,
        headerTitleLeft: string,
        headerTitleRight: string,
        headerLogo: string,
        headerLogoPadding: number,
        headerContainerPadding: { top: number, left: number; bottom: number, right: number }
        headerTextFontSize: number,
        headerLogoWidth: number,
        bodyTextColor: string,
        colorPremium: string,
        colorStandard: string,
        bodyContainerPadding: { top: number, left: number; bottom: number, right: number }
        bodyLogo: string,
        bodyLogoPosition: string,
        bodyLogoWidth: number,
        bodyLabel: string,
        bodyBackgroundImage: boolean,
        bodyBackgroundImageUrl: string
        boxDecorationRadius: number,
    }
    iconInAboutTab: string
    theme: ThemeType
    categories: number[]
    featureFlags: FeatureFlagsType
    applicationUrl: string,
    dataPrivacyPolicyUrl: string,
    publisherAddress: string
    publisherText: string
    disclaimerText: string
}

export type AndroidBuildConfigType = CommonBuildConfigType & {
    // Shows the app icon as splash screen on app start.
    applicationId: string
    featureFlags: {
        excludeLocationPlayServices: boolean
        excludeX86: boolean
    }
}

export type iOSBuildConfigType = CommonBuildConfigType & {
    // iOS application identifier.
    bundleIdentifier: string
}

export default BuildConfigType
