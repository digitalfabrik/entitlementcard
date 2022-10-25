import React from 'react'

const SwitchDisplay = ({ children, value }: { children: { [key: string]: React.ReactNode }; value: string | null }) => {
  return (
    <>
      {Object.entries(children).map(([key, element]) => (
        <div key={key} style={{ display: key === value ? 'block' : 'none' }}>
          {element}
        </div>
      ))}
    </>
  )
}

export default SwitchDisplay
