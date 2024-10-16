import bayern, { bayernCommon } from "../bayern"
import BuildConfigType, { CommonBuildConfigType } from "../types"

let bayernFlossCommon: CommonBuildConfigType = {
    ...bayernCommon,
    appName: "Ehrenamt FLOSS",
}

const bayernFloss: BuildConfigType = {
    common: bayernFlossCommon,
    android: {
        ...bayern.android,
        ...bayernFlossCommon,
        applicationId: "app.ehrenamtskarte.bayern.floss",
        buildFeatures: {
            ...bayern.android.buildFeatures,
            excludeLocationPlayServices: true,
            excludeX86: true,
        },
    },
    ios: {
        ...bayern.ios,
        ...bayernFlossCommon,
    },
}

export default bayernFloss
