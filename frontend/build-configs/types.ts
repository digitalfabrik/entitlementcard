export type BuildConfigType = {
    common: CommonBuildConfigType
    android: AndroidBuildConfigType
    ios: iOSBuildConfigType
}

export type FeatureFlagsType = {
    verification: boolean
    favorites: boolean
}

export type DeeplLinkingConfig = {
    android: {
        path: string
        applicationId: string
        sha256CertFingerprint: string
    }
    ios: {
        appleAppSiteAssociationAppId: string
        path: string
        pathComment: string
    }
    projectName: string
    customScheme: string
}

export type ThemeType = {
    primaryLight: string
    primaryDark: string
    fontFamily: string
}

export type CommonBuildConfigType = {
    appName: string
    appIcon: string
    projectId: {
        showcase: string
        production: string
        local: string
        staging: string
    }
    mapStyleUrl: {
        showcase: string
        staging: string
        production: string
        local: string
    }
    mapInitialCoordinatesLat: number
    mapInitialCoordinatesLng: number
    mapInitialZoomLevel: number
    backendUrl: {
        showcase: string
        staging: string
        production: string
        local: string
    }
    appLocales: string[]
    localeOverridePath: string | null
    cardBranding: {
        headerTextColor: string
        headerColor: string
        headerTitleLeft: string
        headerTitleRight: string
        headerLogo: string
        headerLogoExtraScale: number
        headerLogoPadding: number
        headerContainerPadding: {
            top: number
            left: number
            bottom: number
            right: number
        }
        headerTextFontSize: number
        headerLogoWidth: number
        bodyTextColor: string
        colorPremium: string
        colorStandard: string
        bodyContainerPadding: {
            top: number
            left: number
            bottom: number
            right: number
        }
        bodyLogo: string
        bodyLogoPosition: string
        bodyLogoWidth: number
        bodyLabel: string
        bodyBackgroundImage: boolean
        bodyBackgroundImageUrl: string
        boxDecorationRadius: number
    }
    iconInAboutTab: string
    introSlidesImages: [string, string, string, string]
    theme: ThemeType
    categories: number[]
    featureFlags: FeatureFlagsType
    applicationUrl: {
        staging: string
        production: string
        local: string
    }
    dataPrivacyPolicyUrl: string
    publisherAddress: string
    publisherText: string
    disclaimerText: string
    maxCardAmount: number
    activationPath: string
    deepLinking: DeeplLinkingConfig
}

export type AndroidBuildConfigType = CommonBuildConfigType & {
    // Shows the app icon as splash screen on app start.
    applicationId: string
    buildFeatures: {
        excludeLocationPlayServices: boolean
        excludeX86: boolean
    }
    appStoreLink: string
}

export type iOSBuildConfigType = CommonBuildConfigType & {
    // iOS application identifier.
    bundleIdentifier: string
    provisioningProfileSpecifier: string
    appStoreLink: string
}

export default BuildConfigType
