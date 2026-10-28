import { Box, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import DOMPurify from 'dompurify'
import { ReactElement } from 'react'

type EmailPreviewProps = {
  html: string
  hint: string
  status: string
  statusActive: boolean
}

const EmailPreview = ({ html, hint, status, statusActive }: EmailPreviewProps): ReactElement => (
  <Stack sx={{ gap: 2, height: '100%' }}>
    <Box>
      <Typography variant='body2'>{hint}</Typography>
      <Typography
        variant='body2'
        sx={theme => ({
          color: statusActive ? theme.palette.success.main : theme.palette.text.secondary,
        })}
      >
        {status}
      </Typography>
    </Box>
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        padding: 3,
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        '& p': { marginTop: 0, marginBottom: 2 },
        '& p:last-child': { marginBottom: 0 },
        '& a': { wordBreak: 'break-word' },
        // The backend wraps the customizable parts of the email in a blockquote to highlight them
        '& blockquote': {
          marginX: 0,
          marginTop: 0,
          marginBottom: 2,
          borderLeft: 3,
          borderLeftColor: grey[400],
          paddingLeft: 2,
        },
      }}
      // The html is rendered by the backend and sanitized to prevent XSS
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  </Stack>
)

export default EmailPreview
