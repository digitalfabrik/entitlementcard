import { Region } from '../generated/graphql'
import { bavaria_card_type, birthday_extension, nuernberg_pass_number_extension, region_extension } from './extensions'
import { CardBlueprint } from './CardBlueprint'
import { add } from 'date-fns'

export const createEmptyBavariaCard = (region: Region): CardBlueprint =>
  new CardBlueprint('', add(Date.now(), { years: 2 }), [
    {
      state: bavaria_card_type.initialState,
      extension: bavaria_card_type,
    },
    {
      state: {
        region_id: region.id,
      },
      extension: region_extension,
    },
  ])

export const createEmptyNuernbergCard = (region: Region): CardBlueprint =>
  new CardBlueprint('', add(Date.now(), { years: 2 }), [
    {
      state: {
        region_id: region.id,
      },
      extension: region_extension,
    },
    {
      state: nuernberg_pass_number_extension.initialState,
      extension: nuernberg_pass_number_extension,
    },
    {
      state: birthday_extension.initialState,
      extension: birthday_extension,
    },
  ])
