type BuildConfigType = {
    android: AndroidBuildConfigType,
    ios: iOSBuildConfigType,
}

export type FeatureFlagsType = {
    // Enables additional debugging output for devs (i18n, redux, hidden cities, version).
    developerFriendly: boolean
}

export type CommonBuildConfigType = {
    appName: string
    appIcon: string
    backendUrl: string
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
