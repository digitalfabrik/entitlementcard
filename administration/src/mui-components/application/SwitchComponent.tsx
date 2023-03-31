import React from 'react'

const SwitchComponent = <T extends string>({
  children,
  value,
}: {
  children: { [key in T]: React.ReactElement | null }
  value: T | null
}) => {
  if (value === null) return null
  return children[value]
}

export default SwitchComponent
