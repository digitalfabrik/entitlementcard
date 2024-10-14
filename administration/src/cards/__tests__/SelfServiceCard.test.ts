import PlainDate from '../../util/PlainDate'
import { generateCardInfo, initializeCardBlueprint } from '../CardBlueprint'
import BirthdayExtension, { BIRTHDAY_EXTENSION_NAME } from '../extensions/BirthdayExtension'
import KoblenzReferenceNumberExtension, {
  KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME,
} from '../extensions/KoblenzReferenceNumberExtension'

describe('SelfServiceCard', () => {
  const cardConfig = {
    defaultValidity: { years: 3 },
    nameColumnName: 'Name',
    expiryColumnName: 'Ablaufdatum',
    extensionColumnNames: ['Geburtsdatum', 'Referenznummer'],
    extensions: [BirthdayExtension, KoblenzReferenceNumberExtension],
  }
  const expirationDate = PlainDate.fromLocalDate(new Date()).add(cardConfig.defaultValidity).toDaysSinceEpoch()

  it('should correctly initialize CardBlueprint', () => {
    const card = initializeCardBlueprint(cardConfig, undefined, { fullName: 'Karla Koblenz' })

    expect(card.fullName).toBe('Karla Koblenz')
    expect(card.expirationDate).toEqual(expirationDate)
    expect(card.extensions[BIRTHDAY_EXTENSION_NAME]).toBe(BirthdayExtension.getInitialState().birthday)
    expect(card.extensions[KOBLENZ_REFERENCE_NUMBER_EXTENSION_NAME]).toBe(
      KoblenzReferenceNumberExtension.getInitialState().koblenzReferenceNumber
    )
  })

  it('should generate CardInfo', () => {
    const card = initializeCardBlueprint(cardConfig, undefined, { fullName: 'Karla Koblenz' })
    expect(generateCardInfo(card).toJson()).toEqual({
      fullName: 'Karla Koblenz',
      expirationDay: expirationDate,
      extensions: {
        extensionBirthday: {
          birthday: -25567,
        },
        extensionKoblenzReferenceNumber: {
          referenceNumber: '',
        },
      },
    })
  })
})
