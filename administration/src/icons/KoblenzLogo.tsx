import React, { ReactElement } from 'react'

import svgImage from '../assets/koblenz_logo.svg'

export const KoblenzLogo = ({ height }: { height: string }): ReactElement => (
  <img src={svgImage} alt='KoblenzPass logo' height={height} />
)
