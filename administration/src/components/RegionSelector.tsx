import React, {useContext} from "react";
import {Button, Menu, MenuItem, Spinner} from "@blueprintjs/core";
import {RegionContext} from "../RegionProvider";
import {useQuery} from "@apollo/client";
import {ItemListRenderer, ItemRenderer, Select} from "@blueprintjs/select";
import {GetRegionsDocument, GetRegionsQuery, GetRegionsQueryVariables, Region} from "../generated/graphql";
import {ProjectConfigContext} from "../project-configs/ProjectConfigContext";

const RegionSelect = Select.ofType<Region>()

const getTitle = (region: Region) => `${region.prefix} ${region.name}`

const renderMenu: ItemListRenderer<Region> = ({items, itemsParentRef, renderItem}) => {
    const renderedItems = items.map(renderItem).filter(item => item != null);
    return <Menu ulRef={itemsParentRef} style={{maxHeight: 500, overflow: 'auto'}}>
        {renderedItems}
    </Menu>
};

const itemRenderer: ItemRenderer<Region> = (region, {handleClick, modifiers}) => {
    return <MenuItem
        active={modifiers.active}
        disabled={modifiers.disabled}
        key={region.id}
        onClick={handleClick}
        text={getTitle(region)}
    />
};

const RegionSelector = () => {
    const projectId = useContext(ProjectConfigContext).projectId
    const [region, setRegion] = useContext(RegionContext)
    const {loading, error, data, refetch} = useQuery<GetRegionsQuery, GetRegionsQueryVariables>(GetRegionsDocument, {
        variables: {project: projectId}
    })
    if (loading) return <Spinner/>
    if (error || !data) return <Button icon="repeat" onClick={() => refetch()}/>
    const regions = data.regions
    const activeItem = regions.find((other: Region) => region?.id === other.id)
    return <RegionSelect activeItem={activeItem}
                         items={regions}
                         itemRenderer={itemRenderer}
                         filterable={false}
                         itemListRenderer={renderMenu}
                         onItemSelect={setRegion}>
        <span>Region: <Button text={activeItem ? getTitle(activeItem) : 'Auswählen...'}
                              rightIcon="double-caret-vertical"/></span>
    </RegionSelect>
};

export default RegionSelector;
