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
      main: '#1c2127',
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
      fontWeight: 500,
      marginTop: 10,
      marginBottom: 6,
    },
    button: {
      fontSize: 14,
      fontWeight: 500,
      textTransform: 'none',
      textWrap: 'nowrap',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          variants: [
            {
              props: { variant: 'contained', color: 'primary' },
              style: {
                '&:hover': {
                  color: '#ffffff',
                },
              },
            },
          ],
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
      defaultProps: {
        useFlexGap: true,
      },
      styleOverrides: {
        root: {
          '& *': {
            fontFamily: 'inherit',
            letterSpacing: 'inherit',
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
            paddingLeft: 12,
          },
        },
      ],
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 'inherit',
          backgroundColor: '#1c2127',
          color: '#dddddd',
          padding: 8,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
        },
      },
    },
  },
})
