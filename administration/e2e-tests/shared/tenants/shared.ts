// The e2e tests run against the local backend with the dev data (backend/src/dev/sql)
export const backendUrl = 'http://localhost:8000'

/** Password of all administrators in the dev data */
export const devPassword = 'Administrator!'

export const paths = {
  // admin
  login: '/',
  cards: '/cards',
  cardsAdd: '/cards/add',
  forgotPassword: '/forgot-password',
  stores: '/stores',
  // self service
  selfServiceCreate: '/erstellen',
  // api
  apiUsersImport: `${backendUrl}/users/import`,
}

export const sharedLabels = {
  addCard: 'Karte hinzufügen',
  chooseFile: 'Datei wählen',
  csvExport: 'CSV Export',
  printCards: 'QR-Codes drucken',
}
