import {ReactElement, useContext, useEffect} from "react";
import {ProjectConfigContext} from "../project-configs/ProjectConfigContext";

const MetaTagsManager = (props: { children: ReactElement }) => {
    const config = useContext(ProjectConfigContext)
    useEffect(
        () => {
            document.title = config.name + " Verwaltung"
            const links = Array.from(document.head.getElementsByTagName("link"))
            let iconLink = links.find(link => link.rel === "icon")
            if (iconLink == null) {
                iconLink = document.createElement("link")
                iconLink.rel = "icon"
                document.head.append(iconLink)
            }
            iconLink.href = "/icons/" + config.projectId + ".png"
        },
        [config]
    )
    return props.children
}

export default MetaTagsManager