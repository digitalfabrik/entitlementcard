export type AcceptingStoreFormData = {
  id?: number
  name: string
  street: string
  postalCode: string
  city: string
  telephone: string
  email: string
  homepage: string
  descriptionDe: string
  descriptionEn: string
  categoryId: number
  longitude?: number
  latitude?: number
}

export type UpdateStoreFunction = <K extends keyof AcceptingStoreFormData>(
  field: K,
  value: AcceptingStoreFormData[K]
) => void
