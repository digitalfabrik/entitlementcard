import React, { useContext } from 'react'
import { Button, H3 } from '@blueprintjs/core'
import { Role } from '../../generated/graphql'
import { AuthContext } from '../../AuthProvider'
import { NavLink } from 'react-router-dom'

const HomeController = () => {
  const role = useContext(AuthContext).data?.administrator.role

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <H3>Wählen Sie eine Aktion aus:</H3>
      {role === Role.RegionAdmin || role === Role.RegionManager ? (
        <>
          <NavLink to={'/applications'}>
            <Button style={{ margin: '10px' }} icon='form' text='Eingehende Anträge' />
          </NavLink>
          <NavLink to={'/eak-generation'}>
            <Button style={{ margin: '10px' }} icon='id-number' text='Karten erstellen' />
          </NavLink>
        </>
      ) : null}
      {role === Role.ProjectAdmin || role === Role.RegionAdmin ? (
        <>
           <NavLink to={'/users'}>
             <Button style={{ margin: '10px' }} icon='people' text='Benutzer verwalten' />
           </NavLink>
           <NavLink to={'/region'}>
              <Button style={{ margin: '10px' }} icon='path-search' text='Region verwalten' />
           </NavLink>
         </>
      ) : null}
    </div>
  )
}

export default HomeController
