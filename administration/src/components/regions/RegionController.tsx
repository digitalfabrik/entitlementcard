import React, {ReactElement, useContext} from 'react';
import {RegionContext} from "../../RegionProvider";
import RegionOverview from "./RegionOverview";
import {Region, useGetDataPolicyQuery} from "../../generated/graphql";
import ErrorHandler from "../../ErrorHandler";
import { Spinner } from '@blueprintjs/core';


const RegionController = (props: { region: Region}) => {
    const {loading, error, data, refetch} = useGetDataPolicyQuery({variables:{regionId: props.region.id},  onError: error => console.error(error)})
    if (loading) return <Spinner />
    else if (error || !data)
        return <ErrorHandler refetch={refetch}/>
    else return <RegionOverview dataPrivacyPolicy={data.dataPolicy.dataPrivacyPolicy ?? ''} />
}

const ControllerWithRegion = (): ReactElement => {
    const region = useContext(RegionContext)
    if (region === null) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p>Sie sind nicht berechtigt diese Seite aufzurufen.</p>
            </div>
        )
    } else {
        return <RegionController region={region}  />
    }
};

export default ControllerWithRegion;
