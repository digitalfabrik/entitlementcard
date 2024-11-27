import { MockedProvider as ApolloProvider } from '@apollo/client/testing'
import { act, renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { initializeCard } from '../../../cards/Card'
import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import { LOCAL_STORAGE_PROJECT_KEY } from '../../../project-configs/constants'
import koblenzConfig from '../../../project-configs/koblenz/config'
import PlainDate from '../../../util/PlainDate'
import { AppToasterProvider } from '../../AppToaster'
import useCardGeneratorSelfService from './useCardGeneratorSelfService'

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <AppToasterProvider>
      <ApolloProvider>
        <ProjectConfigProvider>{children}</ProjectConfigProvider>
      </ApolloProvider>
    </AppToasterProvider>
  </MemoryRouter>
)

jest.mock('../../../generated/graphql', () => ({
  ...jest.requireActual('../../../generated/graphql'),
  generatePdf: jest.fn(),
}))
describe('useCardGeneratorSelfService', () => {
  const card = initializeCard(koblenzConfig.card, undefined, {
    fullName: 'Karla Koblenz',
    extensions: { birthday: PlainDate.safeFromCustomFormat('10.06.2003'), koblenzReferenceNumber: '123K' },
  })

  it('should successfully create a card', async () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, koblenzConfig.projectId)

    const { result } = renderHook(() => useCardGeneratorSelfService(), { wrapper })
    act(() => result.current.setSelfServiceCard(card))
    expect(result.current.selfServiceCard).toEqual(card)
    // TODO generate card and check the code, graphQL hook has to be mocked
  })
})
