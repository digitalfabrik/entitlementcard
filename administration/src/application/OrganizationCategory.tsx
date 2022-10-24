import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'

export type OrganizationCategoryFormState = string

export const initialOrganizationCategoryFormState: OrganizationCategoryFormState = ''

const categories = [
  'Soziales/Jugend/Senioren',
  'Tierschutz',
  'Sport',
  'Bildung',
  'Umwelt-/Naturschutz',
  'Kultur',
  'Gesundheit',
  'Katastrophenschutz/Feuerwehr/Rettungsdienst',
  'Kirchen',
  'Andere',
]

export const OrganizationCategoryForm = ({
  state,
  setState,
}: {
  state: OrganizationCategoryFormState
  setState: (value: OrganizationCategoryFormState) => void
}) => {
  const [touched, setTouched] = useState(false)

  let error: string | null = null
  if (state === '') {
    error = `Feld ist erforderlich.`
  }

  const isInvalid = error !== null

  return (
    <FormControl fullWidth variant='standard' required style={{ margin: '4px 0' }} error={touched && isInvalid}>
      <InputLabel>Einsatzgebiet</InputLabel>
      <Select
        value={state}
        label='Einsatzgebiet'
        onBlur={() => setTouched(true)}
        onChange={e => setState(e.target.value)}>
        {categories.map(category => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
      {!touched || !isInvalid ? null : <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

export const convertOrganizationCategoryFormStateToInput = (state: OrganizationCategoryFormState): string => {
  if (state === '') throw Error('invalid category')
  return state
}
