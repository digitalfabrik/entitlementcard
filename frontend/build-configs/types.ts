type BuildConfigType = {
    common: CommonBuildConfigType
    android: AndroidBuildConfigType
    ios: iOSBuildConfigType
}

export type FeatureFlagsType = {
    verification: boolean
}

export type ThemeType = {
    primaryLight: string
    primaryDark: string
}

type SlideType = {
    title: string
    description: string
    imagePath: string
}

export type LocalizationType = {
    identification: {
        noCardView: {
            applyTitle: string
            applyDescription: string
            activateTitle: string
            activateDescription: string
            verifyTitle: string
            verifyDescription: string
        }
        activationCodeScanner: {
            title: string
        }
        verificationCodeScanner: {
            title: string
            infoDialogTitle: string
            positiveVerificationDialogTitle: string
        }
        moreActions: {
            applyForAnotherCardTitle: string
            applyForAnotherCardDescription: string
            activateAnotherCardTitle: string
            activateAnotherCardDescription: string
            activationLimitDescription: string
            verifyTitle: string
            verifyDescription: string
            removeCardTitle: string
            removeCardDescription: string
        }
        removeCardDialog: {
            title: string
            description: string
        }
    }
}

export type CommonBuildConfigType = {
    appName: string
    appIcon: string
    projectId: {
        showcase: string
        production: string
        local: string
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
    cardBranding: {
        headerTextColor: string
        headerColor: string
        headerTitleLeft: string
        headerTitleRight: string
        headerLogo: string
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
    introSlide1: SlideType,
    introSlide2: SlideType,
    introSlide3: SlideType,
    introSlide4: SlideType
    theme: ThemeType
    categories: number[]
    featureFlags: FeatureFlagsType
    applicationUrl: string
    dataPrivacyPolicyUrl: string
    publisherAddress: string
    publisherText: string
    disclaimerText: string
    localization: LocalizationType
    maxCardAmount: number
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
