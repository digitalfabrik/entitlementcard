import { Region } from '../generated/graphql'
import {
  bavaria_card_type,
  birthday_extension,
  createExtensionHolder,
  nuernberg_pass_number_extension,
  region_extension,
} from './extensions'
import { CardBlueprint } from './CardBlueprint'
import { add } from 'date-fns'

export const createEmptyBavariaCard = (region: Region): CardBlueprint =>
  new CardBlueprint('', add(Date.now(), { years: 3 }), [
    createExtensionHolder(region_extension, region),
    createExtensionHolder(bavaria_card_type, null),
  ])

export const createEmptyNuernbergCard = (region: Region): CardBlueprint =>
  new CardBlueprint('', add(Date.now(), { years: 1 }), [
    createExtensionHolder(region_extension, region),
    createExtensionHolder(birthday_extension, null),
    createExtensionHolder(nuernberg_pass_number_extension, null),
  ])
