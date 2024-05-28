import { Button, H4, Popover } from '@blueprintjs/core'
import styled from 'styled-components'

const HelpButton = styled(Button)`
  margin: 0 10px;
`

const Description = styled.ul`
  margin: 4px 0;
`

const Headline = styled(H4)`
  text-align: center;
`

const PopoverContent = styled.div`
  padding: 10px;
`

const ApplicationStatusHelpButton = () => {
  return (
    <Popover
      content={
        <PopoverContent>
          <Headline>Welcher Status hat welche Bedeutung?</Headline>
          <Description>
            <li>
              <b>Offen:</b>
              <Description>
                Alle Anträge, die weder von allen Organisation abgelehnt noch akzeptiert wurden.
                <br />
                Der Antrag kann i.d.R. nicht bearbeitet werden.
              </Description>
            </li>
            <li>
              <b>Akzeptiert:</b>
              <Description>
                Alle Organisationen haben den Antrag verifiziert.
                <br />
                Der Antrag kann bearbeitet werden.
              </Description>
            </li>
            <li>
              <b>Abgelehnt:</b>
              <Description>
                Alle Organisationen haben den Antrag abgelehnt.
                <br />
                Der Antrag kann gelöscht werden.
              </Description>
            </li>
            <li>
              <b>Zurückgezogen:</b>
              <Description>
                Der Antragssteller hat den Antrag zurückgezogen.
                <br />
                Der Antrag kann gelöscht werden.
              </Description>
            </li>
          </Description>
        </PopoverContent>
      }>
      <HelpButton icon='help' minimal />
    </Popover>
  )
}

export default ApplicationStatusHelpButton
