import { add } from 'date-fns'

import { Region } from '../generated/graphql'
import { CardBlueprint } from './CardBlueprint'
import {
  bavariaCardTypeExtension,
  birthdayExtension,
  createExtensionHolder,
  nuernbergPassIdExtension,
  nuernbergPassNumberExtension,
  regionExtension,
} from './extensions'

export const createEmptyBavariaCard = (region: Region): CardBlueprint =>
  new CardBlueprint('', add(Date.now(), { years: 3 }), [
    createExtensionHolder(regionExtension, region),
    createExtensionHolder(bavariaCardTypeExtension, null),
  ])

export const createEmptyNuernbergCard = (region: Region): CardBlueprint =>
  new CardBlueprint('', add(Date.now(), { years: 1 }), [
    createExtensionHolder(regionExtension, region),
    createExtensionHolder(birthdayExtension, null),
    createExtensionHolder(nuernbergPassNumberExtension, null),
    createExtensionHolder(nuernbergPassIdExtension, null),
  ])
