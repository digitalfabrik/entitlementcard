import { Button, InputGroup, InputGroupProps2, Label, Tooltip } from '@blueprintjs/core'
import React, { ReactElement, useState } from 'react'

const ShowPasswordButton = ({ hidden, onClick }: { hidden: boolean; onClick: () => void }) => (
  <Tooltip
    content={hidden ? 'Passwort anzeigen' : 'Passwort verstecken'}
    renderTarget={({ isOpen, ref, ...tooltipProps }) => (
      <Button ref={ref} {...tooltipProps} minimal icon={hidden ? 'eye-open' : 'eye-off'} onClick={onClick} />
    )}
  />
)

const PasswordInput = ({
  label,
  setValue,
  ...otherProps
}: InputGroupProps2 & {
  label: string
  setValue: ((value: string) => void) | null
}): ReactElement => {
  const [passwordHidden, setPasswordHidden] = useState(true)
  return (
    <Label>
      {label}
      <InputGroup
        placeholder={label}
        {...otherProps}
        type={passwordHidden ? 'password' : 'text'}
        onChange={event => setValue?.(event.currentTarget.value)}
        readOnly={setValue === null}
        rightElement={<ShowPasswordButton hidden={passwordHidden} onClick={() => setPasswordHidden(!passwordHidden)} />}
      />
    </Label>
  )
}

export default PasswordInput
