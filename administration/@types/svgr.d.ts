declare module '*.svg' {
  import * as React from 'react'

  const SVG: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default SVG
}
