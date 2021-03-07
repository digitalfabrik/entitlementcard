import { createContext, ReactNode, useState } from "react"

export const RegionIdContext = createContext<[number | null, (id: number|null) => void]>([null, () => {}])

const RegionIdProvider = ({ children }: {children: ReactNode}) => {
    const [regionId, setRegionId] = useState<number | null>(null)
    return <RegionIdContext.Provider value={[regionId, setRegionId]}>
        {children}
    </RegionIdContext.Provider>
}

export default RegionIdProvider
