import { Chip, Divider } from '@mui/material'
import { ReactElement } from 'react'

const CustomDivider = ({ label, onDelete }: { label?: string; onDelete?: () => void }): ReactElement => (
  <Divider textAlign='left' sx={{ margin: '16px' }}>
    {label === undefined ? null : <Chip label={label.toUpperCase()} onDelete={onDelete} />}
  </Divider>
)

export default CustomDivider
