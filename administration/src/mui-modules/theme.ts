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
      contrastText: '#5C6065',
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
    button: {
      fontSize: 14,
      fontWeight: 600,
      textTransform: 'none',
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#0000008a',
        },
      },
    },
    MuiStack: {
      styleOverrides: {
        root: {
          '& *': {
            fontFamily: 'inherit',
            letterSpacing: 'normal',
          },
        },
      },
    },
    MuiMenuItem: {
      variants: [
        {
          props: { color: 'default' },
          style: {
            backgroundColor: '#EEEEEE',
            color: '#5C6065',
            '&:hover': {
              backgroundColor: '#dddddd',
            },
          },
        },
      ],
    },
  },
})
