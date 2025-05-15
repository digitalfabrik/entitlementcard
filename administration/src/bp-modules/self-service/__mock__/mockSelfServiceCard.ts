import { generateCardInfo, initializeCard } from '../../../cards/Card'
import { CreateCardsFromSelfServiceDocument } from '../../../generated/graphql'
import koblenzConfig from '../../../project-configs/koblenz/config'
import PlainDate from '../../../util/PlainDate'
import { uint8ArrayToBase64 } from '../../../util/base64'

export const exampleCard = initializeCard(koblenzConfig.card, undefined, {
  fullName: 'Karla Koblenz',
  extensions: { birthdayMui: PlainDate.safeFromCustomFormat('10.06.2003'), koblenzReferenceNumber: '123K' },
})
export const mockedCardMutation = {
  request: {
    query: CreateCardsFromSelfServiceDocument,
    variables: {
      project: koblenzConfig.projectId,
      generateStaticCodes: true,
      encodedCardInfo: uint8ArrayToBase64(generateCardInfo(exampleCard).toBinary()),
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
}
