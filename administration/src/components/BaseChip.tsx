import { Chip, alpha } from '@mui/material'
import { Property } from 'csstype'
import { ReactElement } from 'react'

type BaseChipProps = {
  label: string
  color: Property.Color
  icon?: ReactElement
  backgroundColor?: Property.BackgroundColor
}

export const BaseChip = ({ label, color, icon, backgroundColor }: BaseChipProps): ReactElement => (
  <Chip
    size='small'
    variant='outlined'
    icon={icon}
    label={label}
    sx={theme => ({
      alignSelf: 'center',
      height: 24,
      padding: theme.spacing(0, 1),
      gap: theme.spacing(0.5),
      color,
      borderColor: color,
      backgroundColor: backgroundColor ?? alpha(color, 0.08),
      fontWeight: 500,
      fontSize: theme.typography.body2.fontSize,
      '& .MuiChip-icon': { margin: 0, color: 'inherit', fontSize: 16 },
      '& .MuiChip-label': { padding: 0 },
    })}
  />
)
