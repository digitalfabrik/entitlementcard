import { createContext, ReactNode, useState } from "react"
import {getRegions_regions as Region} from "./graphql/regions/__generated__/getRegions";

export const RegionContext = createContext<[Region | null, (region: Region|null) => void]>([null, () => {}])

const RegionProvider = ({ children }: {children: ReactNode}) => {
    const [region, setRegionId] = useState<Region | null>(null)
    return <RegionContext.Provider value={[region, setRegionId]}>
        {children}
    </RegionContext.Provider>
}

export default RegionProvider
