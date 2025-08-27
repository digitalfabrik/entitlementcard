import { CsvAcceptingStoreInput } from '../../../generated/graphql'
import { CSVStoreInput } from '../AcceptingStoresEntry'

/** mock of raw csv store data */
export const invalidStoreData: CSVStoreInput = {
  categoryId: '25',
  discountDE: '20% Ermäßigung für Erwachsene',
  discountEN: '20% discount for adults',
  email: 'info@academie-ballettschule-uliczay.de',
  homepage: 'https://www.academie-ballettschule-uliczay.de/kontakt/',
  houseNumber: '10',
  latitude: '49.4622598',
  location: 'Nürnberg',
  longitude: 'asda3',
  name: '',
  postalCode: '90408',
  street: 'Meuschelstr.',
  telephone: '0911/9944884',
}
/** mock of raw csv store data */
export const validStoreData: CSVStoreInput = {
  categoryId: '15',
  discountDE: '20% Ermäßigung für Erwachsene',
  discountEN: '20% discount for adults',
  email: 'info@academie-ballettschule-uliczay.de',
  homepage: 'https://www.academie-ballettschule-uliczay.de/kontakt/',
  houseNumber: '10',
  latitude: '49.4622598',
  location: 'Nürnberg',
  longitude: '49.4622598',
  name: 'TestStpre',
  postalCode: '90408',
  street: 'Meuschelstr.',
  telephone: '0911/9944884',
}

export const validStoreDataForImport: CsvAcceptingStoreInput = {
  name: 'TestStpre',
  street: 'Meuschelstr.',
  houseNumber: '10',
  postalCode: '90408',
  location: 'Nürnberg',
  latitude: 49.4622598,
  longitude: 49.4622598,
  telephone: '0911/9944884',
  email: 'info@academie-ballettschule-uliczay.de',
  homepage: 'https://www.academie-ballettschule-uliczay.de/kontakt/',
  discountDE: '20% Ermäßigung für Erwachsene',
  discountEN: '20% discount for adults',
  categoryId: 15,
}
