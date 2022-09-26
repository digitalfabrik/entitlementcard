import bayernConfig from "./bayern/config"
import nuernbergConfig from './nuernberg/config'
import showcaseConfig from './showcase/config'


export interface ProjectConfig {
    name: string,
    projectId: string
}


const getProjectConfig = (hostname: string): ProjectConfig => {
    switch (hostname) {
        case "bayern.ehrenamtskarte.app":
            return bayernConfig
        case "nuernberg.sozialpass.app":
            return nuernbergConfig
        default:
            console.debug("Falling back to showcase.")
            return showcaseConfig
    }
}

export default getProjectConfig