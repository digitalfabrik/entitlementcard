import { paths } from './shared'

export const koblenz = {
  projectId: 'koblenz.sozialpass.app',
  urls: {
    selfServiceCreate: paths.selfServiceCreate,
    apiUsersImport: paths.apiUsersImport,
  },
  labels: {
    // card data
    firstName: 'Vorname Name',
    birthDate: 'Geburtsdatum',
    fileReference: 'Aktenzeichen',
    privacyPolicy: /Datenschutzerklärung/,
    // actions
    submit: 'KoblenzPass erstellen',
    proceed: 'Weiter zur Aktivierung',
    activationLink: 'KoblenzPass jetzt aktivieren',
    downloadPdf: 'KoblenzPass PDF',
    // errors
    revokedToast: 'Sie sind nicht länger berechtigt',
    unknownToast: 'Wir konnten Ihre Angaben nicht im System finden.',
  },
  credentials: {
    // User import api tokens from the dev data (backend/src/dev/sql/apitokens.sql)
    apiToken: 'koblenz-user-import-token',
    apiTokenExpired: 'koblenz-user-import-token-expired',
  },
}
