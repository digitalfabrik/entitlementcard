import { Box, Button } from '@mui/material'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

type FooterProps = {
  showDataPrivacy?: boolean
}

const Footer = ({ showDataPrivacy = true }: FooterProps): ReactElement => {
  const { t } = useTranslation('misc')
  return (
    <Box
      sx={{
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        gap: 3,
        padding: 1,
      }}
    >
      <Button href='/imprint' variant='text'>
        {t('imprint')}
      </Button>
      {showDataPrivacy && (
        <Button href='/data-privacy-policy' variant='text'>
          {t('dataPrivacy')}
        </Button>
      )}
    </Box>
  )
}

export default Footer
