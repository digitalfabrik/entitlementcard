import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { act, renderHook } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { generateCardInfo, initializeCard } from '../../../cards/Card'
import { CreateCardsFromSelfServiceDocument } from '../../../generated/graphql'
import { ProjectConfigProvider } from '../../../project-configs/ProjectConfigContext'
import { LOCAL_STORAGE_PROJECT_KEY } from '../../../project-configs/constants'
import koblenzConfig from '../../../project-configs/koblenz/config'
import PlainDate from '../../../util/PlainDate'
import { uint8ArrayToBase64 } from '../../../util/base64'
import { AppToasterProvider } from '../../AppToaster'
import useCardGeneratorSelfService from './useCardGeneratorSelfService'

const mocks: MockedResponse[] = []

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <AppToasterProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProjectConfigProvider>{children}</ProjectConfigProvider>
      </MockedProvider>
    </AppToasterProvider>
  </MemoryRouter>
)

jest.mock('../../../generated/graphql', () => ({
  ...jest.requireActual('../../../generated/graphql'),
  generatePdf: jest.fn(),
}))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('useCardGeneratorSelfService', () => {
  const card = initializeCard(koblenzConfig.card, undefined, {
    fullName: 'Karla Koblenz',
    extensions: { birthday: PlainDate.safeFromCustomFormat('10.06.2003'), koblenzReferenceNumber: '123K' },
  })

  it('should successfully create a card', async () => {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, koblenzConfig.projectId)
    mocks.push({
      request: {
        query: CreateCardsFromSelfServiceDocument,
        variables: {
          project: koblenzConfig.projectId,
          generateStaticCodes: true,
          encodedCardInfo: uint8ArrayToBase64(generateCardInfo(card).toBinary()),
        },
      },

      result: {
        data: {
          card: {
            dynamicActivationCode: {
              cardInfoHashBase64: '6vLYQiU1un0vJBsEkvwRGjd4FaQvX/ai4xUN95rp5y4=',
              codeBase64:
                'Ci0KDUthcmxhIEtvYmxlbnoQ5p8BGhgKAghfEgQI6r4BKgQIi5oBMgYKBDEyM0sSEC/5Xt8WBjSCkudIKHeCE5saFDlGBqv4wBPfWyuHnTD6NiN6I6+/',
            },
            staticVerificationCode: {
              cardInfoHashBase64: 'y13Ua0VilM29n/vDZOG6T86rslmnyNJ2TH4LBIr8IBE=',
              codeBase64: 'Ci0KDUthcmxhIEtvYmxlbnoQ5p8BGhgKAghfEgQI6r4BKgQIi5oBMgYKBDEyM0sSEIucOBuTDmlimynsrXgvfgs=',
            },
          },
        },
      },
    })

    const { result } = renderHook(() => useCardGeneratorSelfService(), { wrapper })
    act(() => result.current.setSelfServiceCard(card))
    expect(result.current.selfServiceCard).toEqual(card)
    await act(async () => await result.current.generateCards())
    // TODO generate card and check the code, graphQL hook has to be mocked
  })
})
