import CloseIcon from '@mui/icons-material/Close'
import { IconButton, styled } from '@mui/material'
import { closeSnackbar, MaterialDesignContent, SnackbarKey, SnackbarProvider } from 'notistack'
import React, { ReactElement, ReactNode, useCallback } from 'react'

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

export const AppSnackbarProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const action = useCallback(
    (snackbarKey: SnackbarKey) => (
      <IconButton
        aria-label='close snackbar'
        sx={{
          color: 'inherit',
        }}
        onClick={() => closeSnackbar(snackbarKey)}>
        <CloseIcon />
      </IconButton>
    ),
    []
  )

  return (
    <SnackbarProvider
      maxSnack={Number.MAX_VALUE}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      hideIconVariant
      action={action}
      Components={{
        success: StyledMaterialDesignSnackbar,
        info: StyledMaterialDesignSnackbar,
        warning: StyledMaterialDesignSnackbar,
        error: StyledMaterialDesignSnackbar,
        default: StyledMaterialDesignSnackbar,
      }}>
      {children}
    </SnackbarProvider>
  )
}
