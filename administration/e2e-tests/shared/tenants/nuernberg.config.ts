import { devPassword, paths, sharedLabels } from './shared'

export const nuernberg = {
  projectId: 'nuernberg.sozialpass.app',
  urls: {
    login: paths.login,
    cards: paths.cards,
    cardsAdd: paths.cardsAdd,
    forgotPassword: paths.forgotPassword,
    stores: paths.stores,
  },
  labels: {
    ...sharedLabels,
    // card data
    name: 'Name',
    birthDate: 'Geburtsdatum',
    startDate: 'Startdatum',
    expiryDate: 'Ablaufdatum',
    passId: 'Nürnberg-Pass-ID',
  },
  credentials: {
    // Only region administrators and managers are allowed to create cards
    regionAdmin: {
      email: 'region-admin@nuernberg.sozialpass.app',
      password: devPassword,
    },
    storeManager: {
      email: 'project-store-manager@nuernberg.sozialpass.app',
      password: devPassword,
    },
  },
}
