import { Box } from '@mui/material'
import { Fragment, ReactElement, ReactNode } from 'react'

type VerificationDetailsProps = {
  rows: { label: string; value: ReactNode }[]
}

const VerificationDetails = ({ rows }: VerificationDetailsProps): ReactElement => (
  <Box
    component='dl'
    sx={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gridAutoRows: '1fr',
      alignItems: 'center',
      gap: '4px',
      margin: 0,
    }}
  >
    {rows.map(({ label, value }) => (
      <Fragment key={label}>
        <dt>{label}:</dt>
        <Box component='dd' sx={{ margin: 0, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {value}
        </Box>
      </Fragment>
    ))}
  </Box>
)

export default VerificationDetails
