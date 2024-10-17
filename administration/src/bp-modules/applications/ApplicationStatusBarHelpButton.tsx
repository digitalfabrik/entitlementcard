import { Button, H4, Popover } from '@blueprintjs/core'
import React, { ReactElement } from 'react'
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

const ApplicationStatusHelpButton = (): ReactElement => (
  <Popover
    content={
      <PopoverContent>
        <Headline>Welcher Status hat welche Bedeutung?</Headline>
        <Description>
          <li>
            <b>Akzeptiert:</b>
            <Description>
              Der Antrag wurden von allen Organisationen geprüft und genehmigt.
              <br />
              Die Karte kann erstellt werden.
            </Description>
          </li>
          <li>
            <b>Abgelehnt:</b>
            <Description>
              Der Antrag wurde von allen Organisationen abgelehnt.
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
          <li>
            <b>Offen:</b>
            <Description>
              Der Antrag wurde noch nicht von allen Organisationen geprüft.
              <br />
              Die Karte sollte noch nicht erstellt werden.
            </Description>
          </li>
        </Description>
      </PopoverContent>
    }>
    <HelpButton icon='help' minimal />
  </Popover>
)

export default ApplicationStatusHelpButton
