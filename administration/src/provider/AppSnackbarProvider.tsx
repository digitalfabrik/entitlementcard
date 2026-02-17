import CloseIcon from '@mui/icons-material/Close'
import { IconButton, styled } from '@mui/material'
import { MaterialDesignContent, SnackbarProvider, useSnackbar } from 'notistack'
import React, { ReactElement, ReactNode } from 'react'

const StyledMaterialDesignSnackbar = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-success': {
    color: theme.palette.success.contrastText,
    backgroundColor: theme.palette.success.main,
  },
  '&.notistack-MuiContent-info': {
    color: theme.palette.info.contrastText,
    backgroundColor: theme.palette.info.main,
  },
  '&.notistack-MuiContent-warning': {
    color: theme.palette.warning.contrastText,
    backgroundColor: theme.palette.warning.main,
  },
  '&.notistack-MuiContent-error': {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
  },
  '&.notistack-MuiContent-default': {
    color: theme.palette.getContrastText(theme.palette.background.paper),
    backgroundColor: theme.palette.background.paper,
  },
}))

const CloseButton = () => {
  const { closeSnackbar } = useSnackbar()

  return (
    <IconButton
      aria-label='close snackbar'
      sx={{
        color: 'inherit',
      }}
      onClick={() => closeSnackbar()}
    >
      <CloseIcon />
    </IconButton>
  )
}

export const AppSnackbarProvider = ({ children }: { children: ReactNode }): ReactElement => (
  <SnackbarProvider
    maxSnack={Number.MAX_VALUE}
    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    hideIconVariant
    action={<CloseButton />}
    Components={{
      success: StyledMaterialDesignSnackbar,
      info: StyledMaterialDesignSnackbar,
      warning: StyledMaterialDesignSnackbar,
      error: StyledMaterialDesignSnackbar,
      default: StyledMaterialDesignSnackbar,
    }}
  >
    {children}
  </SnackbarProvider>
)
