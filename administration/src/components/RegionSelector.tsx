import React, {useContext} from "react";
import {Button, Menu, MenuItem, PopoverPosition, Spinner} from "@blueprintjs/core";
import {RegionIdContext} from "../RegionIdProvider";
import {useQuery} from "@apollo/client";
import {GET_REGIONS} from "../graphql/regions/queries";
import {ItemListRenderer, ItemRenderer, Select} from "@blueprintjs/select";
import {getRegions_regions as Region} from "../graphql/regions/__generated__/getRegions";

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
    const [regionId, setRegionId] = useContext(RegionIdContext)
    const {loading, error, data, refetch} = useQuery(GET_REGIONS)
    if (loading) return <Spinner/>
    if (error || !data) return <Button icon="repeat" onClick={refetch}/>
    const regions = data.regions
    const activeItem = regions.find((region: Region) => region.id === regionId)
    return <RegionSelect activeItem={activeItem}
                         items={regions}
                         itemRenderer={itemRenderer}
                         filterable={false}
                         popoverProps={{placement: PopoverPosition.TOP}}
                         itemListRenderer={renderMenu}
                         onItemSelect={item => setRegionId(item.id)}>
        <span>Region: <Button text={activeItem ? getTitle(activeItem) : 'Auswählen...'}
                              rightIcon="double-caret-vertical"/></span>
    </RegionSelect>
};

export default RegionSelector;
