import { createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import { Theme } from '@mui/system'
import { deDE } from '@mui/x-data-grid/locales'

import { ProjectConfig } from '../project-configs/getProjectConfig'
import LinkBehavior from './util/LinkBehavior'

export const theme = (config: ProjectConfig): Theme =>
  createTheme(
    {
      palette: config.colorPalette,
      typography: {
        fontFamily: 'Inter, Roboto, sans-serif',
        h1: {
          fontSize: '3.125rem',
          lineHeight: 1.0,
          fontWeight: 600,
          letterSpacing: '-2px',
          marginBottom: '0.7em',
        },
        h2: {
          fontSize: '2.625rem',
          lineHeight: 1.2,
          fontWeight: 600,
          letterSpacing: '-1px',
          marginBottom: '0.7em',
        },
        h3: {
          fontSize: '2.125rem',
          lineHeight: 1.1,
          fontWeight: 600,
          letterSpacing: 0,
          marginBottom: '0.7em',
        },
        h4: {
          fontSize: '1.75rem',
          lineHeight: 1.1,
          fontWeight: 600,
          letterSpacing: 0,
          marginBottom: '0.7em',
        },
        h5: {
          fontSize: '1.375rem',
          lineHeight: 1.1,
          fontWeight: 600,
          letterSpacing: 0,
          marginBottom: '0.7em',
        },
        h6: {
          fontSize: '1.125rem',
          lineHeight: 1.2,
          fontWeight: 600,
          letterSpacing: 0,
          marginBottom: '0.7em',
        },
        subtitle1: {
          fontSize: '1.125rem',
          lineHeight: 1.3,
          fontWeight: 400,
          letterSpacing: 0,
          marginBottom: '0.7em',
        },
        subtitle2: {
          fontSize: '1rem',
          lineHeight: 1.3,
          fontWeight: 500,
          letterSpacing: 0,
          marginBottom: '0.7em',
        },
        body1: {
          fontSize: '1rem',
          lineHeight: 1.3,
          fontWeight: 400,
          letterSpacing: 0,
        },
        body2: {
          fontSize: '0.875rem',
          lineHeight: 1.4,
          fontWeight: 400,
          letterSpacing: 0,
        },
        body2bold: {
          fontSize: '0.875rem',
          lineHeight: 1.4,
          fontWeight: 700,
          letterSpacing: 0,
        },
        button: {
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: 0,
          lineHeight: 1.8,
          textTransform: 'none',
          textWrap: 'nowrap',
        },
        caption: {
          fontSize: '0.75rem',
          lineHeight: 1.3,
          letterSpacing: '0.5px',
          fontWeight: 400,
        },
        overline: {
          fontSize: '0.625rem',
          lineHeight: 1.3,
          fontWeight: 400,
          textTransform: 'uppercase',
          letterSpacing: '2px',
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
              '&.MuiButton-colorInherit': {
                color: '#5C6065',
                '&[href]:hover': {
                  color: '#5C6065',
                },
              },
              '&.MuiButton-contained': {
                '&[href]:hover': {
                  color: grey[200],
                },
              },
              variants: [
                {
                  props: { variant: 'outlined', color: 'inherit' },
                  style: {
                    borderColor: grey[200],
                    borderWidth: '2px',
                  },
                },
                {
                  props: { variant: 'contained', color: 'inherit' },
                  style: {
                    backgroundColor: '#F6F7F9',
                    borderStyle: 'solid',
                    borderColor: grey[200],
                    borderWidth: '1px',
                    ':hover': {
                      backgroundColor: '#e9eaedff',
                    },
                  },
                },
                {
                  props: { variant: 'contained' },
                  style: {
                    boxShadow: '0 2px 2px #BBBBBB',
                    ':hover': {
                      boxShadow: '0 2px 2px #BBBBBB',
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
        },
        MuiMenuItem: {
          variants: [
            {
              props: { color: 'default' },
              style: {
                backgroundColor: grey[200],
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
        MuiTypography: {
          defaultProps: {
            variant: 'body2',
          },
          variants: [
            {
              props: { component: 'p' },
              style: {
                marginBottom: 8,
              },
            },
          ],
        },
        MuiLink: {
          defaultProps: {
            component: LinkBehavior,
          },
        },
        MuiButtonBase: {
          defaultProps: {
            LinkComponent: LinkBehavior,
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            '#root': {
              height: '100dvh',
              display: 'flex',
              flexFlow: 'column nowrap',
            },
          },
        },
        MuiInputBase: {
          styleOverrides: {
            root: {
              fontSize: '0.875rem',
            },
          },
        },
        MuiAutocomplete: {
          styleOverrides: {
            option: {
              fontSize: '14px',
            },
          },
        },
        MuiDialogContentText: {
          styleOverrides: {
            root: {
              color: 'inherit',
            },
          },
        },
      },
    },
    deDE
  )
