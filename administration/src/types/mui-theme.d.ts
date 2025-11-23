/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { TypographyPropsVariantOverrides } from '@mui/material/Typography'
import { Palette, PaletteOptions, TypographyVariants, TypographyVariantsOptions } from '@mui/material/styles'
import * as React from 'react'

// Enable and disable typography variants according to our design system
// docs: https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants

declare module '@mui/material/styles' {
  // allow configuration using `createTheme()`
  interface TypographyVariantsOptions {
    body2bold?: React.CSSProperties
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body2bold: true
  }
}

declare module '@mui/material/styles' {
  interface Palette {
    accent?: PaletteColor
  }

  interface PaletteOptions {
    accent?: PaletteColor
  }
}
