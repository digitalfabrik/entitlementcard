import { initializeCard } from '../../../cards/card'
import { config } from '../../../project-configs/koblenz/config'
import { safeParseGermanPlainDateString } from '../../../util/date'

export const exampleCard = initializeCard(config.card, undefined, {
  fullName: 'Karla Koblenz',
  extensions: {
    birthday: safeParseGermanPlainDateString('10.06.2003'),
    koblenzReferenceNumber: '123K',
  },
})

export const mockedCardMutationResult = {
  data: {
    card: {
      dynamicActivationCode: {
        cardInfoHashBase64: '6vLYQiU1un0vJBsEkvwRGjd4FaQvX/ai4xUN95rp5y4=',
        codeBase64:
          'Ci0KDUthcmxhIEtvYmxlbnoQ5p8BGhgKAghfEgQI6r4BKgQIi5oBMgYKBDEyM0sSEC/5Xt8WBjSCkudIKHeCE5saFDlGBqv4wBPfWyuHnTD6NiN6I6+/',
      },
      staticVerificationCode: {
        cardInfoHashBase64: 'y13Ua0VilM29n/vDZOG6T86rslmnyNJ2TH4LBIr8IBE=',
        codeBase64:
          'Ci0KDUthcmxhIEtvYmxlbnoQ5p8BGhgKAghfEgQI6r4BKgQIi5oBMgYKBDEyM0sSEIucOBuTDmlimynsrXgvfgs=',
      },
    },
  },
}
