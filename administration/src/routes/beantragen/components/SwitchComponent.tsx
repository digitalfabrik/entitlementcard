import { ReactElement } from 'react'

const SwitchComponent = <T extends string>({
  children,
  value,
}: {
  children: { [key in T]: ReactElement | null }
  value: T | null
}): ReactElement | null => {
  if (value === null) {
    return null
  }
  return children[value]
}

export default SwitchComponent
