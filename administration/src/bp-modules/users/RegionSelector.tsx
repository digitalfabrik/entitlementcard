import { Button, Menu } from '@blueprintjs/core'
import { Classes, ItemListRenderer, ItemRenderer, Select } from '@blueprintjs/select'
import React, { useContext, useMemo } from 'react'

import { Region, useGetRegionsQuery } from '../../generated/graphql'
import { ProjectConfigContext } from '../../project-configs/ProjectConfigContext'
import useQueryHandler from '../hooks/useQueryHandler'

const RegionSelect = Select.ofType<Region>()

const getTitle = (region: Region) => `${region.prefix} ${region.name}`

const renderMenu: ItemListRenderer<Region> = ({ itemsParentRef, renderItem, filteredItems }) => {
  const renderedItems = filteredItems.map(renderItem).filter(item => item != null)
  return (
    <Menu ulRef={itemsParentRef} style={{ maxHeight: 500, overflow: 'auto' }}>
      {renderedItems}
    </Menu>
  )
}

const itemRenderer: ItemRenderer<Region> = (region, { handleClick, modifiers }) => {
  return (
    <Button
      style={{ display: 'block' }}
      fill
      key={region.id}
      minimal
      onClick={handleClick}
      active={modifiers.active}
      disabled={modifiers.disabled}>
      {getTitle(region)}
    </Button>
  )
}

const RegionSelector = (props: { onSelect: (region: Region) => void; selectedId: number | null }) => {
  const projectId = useContext(ProjectConfigContext).projectId
  const regionsQuery = useGetRegionsQuery({
    variables: { project: projectId },
  })
  const regionsQueryResult = useQueryHandler(regionsQuery)

  const regions = useMemo(
    () =>
      regionsQueryResult.successful
        ? [...regionsQueryResult.data.regions].sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [regionsQueryResult]
  )

  if (!regionsQueryResult.successful) return regionsQueryResult.component

  const activeItem = regions?.find((other: Region) => props.selectedId === other.id)
  return (
    <RegionSelect
      activeItem={activeItem}
      items={regions}
      itemRenderer={itemRenderer}
      filterable={true}
      itemListPredicate={(filter, items) =>
        items.filter(region => getTitle(region).toLowerCase().includes(filter.toLowerCase()))
      }
      fill
      itemListRenderer={renderMenu}
      onItemSelect={props.onSelect}>
      <div style={{ position: 'relative' }}>
        {/* Make the browser think there is an actual select element to make it validate the form. */}
        <select
          style={{ height: '30px', opacity: 0, pointerEvents: 'none', position: 'absolute' }}
          value={activeItem?.id ?? ''}
          onChange={() => {}}
          required
          tabIndex={-1}>
          <option value={activeItem?.id ?? ''} disabled>
            {activeItem ? getTitle(activeItem) : 'Auswählen...'}
          </option>
        </select>
        <Button
          className={Classes.SELECT}
          style={{ justifyContent: 'space-between', padding: '0 10px' }}
          fill
          rightIcon='double-caret-vertical'>
          {activeItem ? getTitle(activeItem) : 'Auswählen...'}
        </Button>
      </div>
    </RegionSelect>
  )
}

export default RegionSelector
