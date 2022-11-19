import React from 'react'

const SwitchComponent = ({
  children,
  value,
}: {
  children: { [key: string]: React.ReactElement | null }
  value: string | null
}) => {
  if (value === null) return null
  return children[value]
}

export default SwitchComponent
