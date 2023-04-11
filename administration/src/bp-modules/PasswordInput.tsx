import { Button, InputGroup, InputGroupProps2, Label } from '@blueprintjs/core'
import { Tooltip2 } from '@blueprintjs/popover2'
import { useState } from 'react'

const ShowPasswordButton = (props: { hidden: boolean; onClick: () => void }) => {
  return (
    <Tooltip2
      content={props.hidden ? 'Passwort anzeigen' : 'Passwort verstecken'}
      renderTarget={({ isOpen, ref, ...tooltipProps }) => (
        <Button
          elementRef={ref}
          {...tooltipProps}
          minimal
          icon={props.hidden ? 'eye-open' : 'eye-off'}
          onClick={props.onClick}
        />
      )}
    />
  )
}

const PasswordInput = ({
  label,
  setValue,
  ...otherProps
}: InputGroupProps2 & { label: string; setValue: (value: string) => void }) => {
  const [passwordHidden, setPasswordHidden] = useState(true)
  return (
    <Label>
      {label}
      <InputGroup
        placeholder={label}
        {...otherProps}
        type={passwordHidden ? 'password' : 'text'}
        onChange={event => setValue(event.currentTarget.value)}
        rightElement={<ShowPasswordButton hidden={passwordHidden} onClick={() => setPasswordHidden(!passwordHidden)} />}
      />
    </Label>
  )
}

export default PasswordInput
