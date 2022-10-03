import {useQuery} from "@apollo/client";
import {Button, Spinner} from "@blueprintjs/core";
import {createContext, ReactNode, useContext} from "react"
import {GetRegionsDocument, GetRegionsQuery, GetRegionsQueryVariables, Region} from "./generated/graphql";
import {ProjectConfigContext} from "./project-configs/ProjectConfigContext";
import {AuthContext} from "./AuthProvider";

export const RegionContext = createContext<Region | null>(null)

const RegionProvider = ({children}: { children: ReactNode }) => {
    const {projectId} = useContext(ProjectConfigContext)
    const [authContextData, _] = useContext(AuthContext)
    const userRegionId = authContextData?.administrator.regionId
    const {loading, error, data, refetch} = useQuery<GetRegionsQuery, GetRegionsQueryVariables>(GetRegionsDocument, {
        variables: {project: projectId}
    })
    if (loading) return <Spinner/>
    if (error || !data) return <Button icon="repeat" onClick={() => refetch()}/>
    const region = data.regions.find(region => region.id == userRegionId)
    if (!region && typeof userRegionId == "number") {
        return <>
            <p>Your region was not found.</p>
            <Button icon="repeat" onClick={() => refetch()}/>
        </>
    }
    return <RegionContext.Provider value={region ?? null}>
        {children}
    </RegionContext.Provider>
}

export default RegionProvider
