import { Search } from '@mui/icons-material'
import { Autocomplete, InputAdornment, Stack, TextField } from '@mui/material'
import React, { ReactElement, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Region, useGetRegionsQuery } from '../../../generated/graphql'
import { ProjectConfigContext } from '../../../project-configs/ProjectConfigContext'
import FormAlert from '../../../shared/components/FormAlert'
import getQueryResult from '../../../util/getQueryResult'

const getTitle = (region?: Region): string | undefined => (region ? `${region.prefix} ${region.name}` : undefined)

const RegionSelector = ({
  onSelect,
  selectedId,
}: {
  onSelect: (region?: Region) => void
  selectedId: number | null
}): ReactElement => {
  const { t } = useTranslation('users')
  const projectId = useContext(ProjectConfigContext).projectId
  const regionsQuery = useGetRegionsQuery({
    variables: { project: projectId },
  })
  const regionsQueryResult = getQueryResult(regionsQuery)

  const regions = useMemo(
    () =>
      regionsQueryResult.successful
        ? [...regionsQueryResult.data.regions].sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [regionsQueryResult]
  )

  if (!regionsQueryResult.successful) {
    return regionsQueryResult.component
  }

  return (
    <Stack gap={0}>
      <Autocomplete
        value={selectedId != null ? getTitle(regions.find(region => region.id === selectedId)) : null}
        renderInput={params => (
          <TextField
            sx={{ marginY: -2 }}
            {...params}
            variant='outlined'
            label={t('region')}
            required
            slotProps={{
              input: {
                ...params.InputProps,
                size: 'small',
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        options={regions.map(region => getTitle(region))}
        sx={{ marginTop: 2, marginBottom: 0 }}
        onChange={(_, value) => onSelect(regions.find(region => getTitle(region) === value))}
      />
      {selectedId == null && <FormAlert errorMessage={t('noRegionError')} />}
    </Stack>
  )
}

export default RegionSelector
