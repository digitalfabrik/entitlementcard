type BuildConfigType = {
    common: CommonBuildConfigType
    android: AndroidBuildConfigType,
    ios: iOSBuildConfigType,
}

export type FeatureFlagsType = {
    verification: boolean
}

export type ThemeType = {
    primaryColor: string,
    secondaryColor: string
}

export type CommonBuildConfigType = {
    appName: string
    appIcon: string
    projectId: string
    mapDataHost: {
        staging: string,
        production: string,
        local: string,
    },
    backendUrl: {
        staging: string,
        production: string,
        local: string,
    }
    theme: ThemeType
    categories: number[]
    featureFlags: FeatureFlagsType
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
