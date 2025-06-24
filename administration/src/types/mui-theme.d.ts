/* eslint-disable @typescript-eslint/consistent-type-definitions */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonPropsColorOverrides } from '@mui/material/Button'
import { PaletteColor, PaletteColorOptions } from '@mui/material/styles/createPalette'

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    default: PaletteColor
    defaultInverted: PaletteColor
  }

  interface PaletteOptions {
    default: PaletteColorOptions
    defaultInverted: PaletteColorOptions
  }
}

declare module '@mui/material/Button/Button' {
  // https://mui.com/material-ui/customization/palette/#typescript
  interface ButtonPropsColorOverrides {
    default: true
    'default.dark': true
    defaultInverted: true
  }
}
