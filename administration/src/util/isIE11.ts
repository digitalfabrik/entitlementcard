import { detect } from 'detect-browser'

const isIE11 = () => {
  const browser = detect()
  return browser?.name === 'ie' && browser?.version?.substr(0, 2) === '11'
}

export default isIE11
