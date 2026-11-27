export type NuernbergStore = {
  name: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  category: string
  phone?: string
  email?: string
  homepage?: string
  descriptionDe?: string
  descriptionEn?: string
}

export const stores = {
  create: {
    name: 'Playwright Test Store',
    street: 'Hauptstraße',
    houseNumber: '1',
    postalCode: '90402',
    city: 'Nürnberg',
    category: 'Bildung',
    phone: '0911/1234567',
    email: 'test@example.com',
    homepage: 'https://www.example.com',
    descriptionDe: 'Testbeschreibung auf Deutsch.',
    descriptionEn: 'Test description in English.',
  },
  edit: {
    name: 'Playwright Edit Store',
    street: 'Entengasse',
    houseNumber: '5',
    postalCode: '90402',
    city: 'Nürnberg',
    category: 'Sonstiges',
  },
  delete: {
    name: 'Playwright Delete Store',
    street: 'Grubenweg',
    houseNumber: '9',
    postalCode: '90455',
    city: 'Nürnberg',
    category: 'Mobilität',
  },
} as const satisfies Record<string, NuernbergStore>

export const editedName = stores.edit.name + ' (bearbeitet)'
