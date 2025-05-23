import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
    },
    error: {
      main: '#CC4246',
    },
    warning: {
      main: '#9C6324',
      light: '#faf0e8',
    },
    text: {
      primary: '#1c2127',
      disabled: '#898989',
    },
    default: {
      main: '#EEEEEE',
      light: '#f0f0f0',
      dark: '#dddddd',
    },
    defaultInverted: {
      main: '#1c2127',
      contrastText: '#dddddd',
    },
  },
  typography: {
    h4: {
      fontSize: '1.1rem',
      lineHeight: 1.1,
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
        },
      },
    },
  },
})
