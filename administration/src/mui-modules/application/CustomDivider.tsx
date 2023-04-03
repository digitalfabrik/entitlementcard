import { Chip, Divider } from '@mui/material'

const CustomDivider = ({ label, onDelete }: { label?: string; onDelete?: () => void }) => (
  <Divider textAlign='left' sx={{ margin: '16px' }}>
    {label === undefined ? null : <Chip label={label.toUpperCase()} onDelete={onDelete} />}
  </Divider>
)

export default CustomDivider
