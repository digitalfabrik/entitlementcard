import {createContext, ReactNode, useState} from "react"
import {Region} from "./generated/graphql";

export const RegionContext = createContext<[Region | null, (region: Region | null) => void]>([null, () => {
}])

const RegionProvider = ({children}: { children: ReactNode }) => {
    const [region, setRegionId] = useState<Region | null>(null)
    return <RegionContext.Provider value={[region, setRegionId]}>
        {children}
    </RegionContext.Provider>
}

export default RegionProvider
