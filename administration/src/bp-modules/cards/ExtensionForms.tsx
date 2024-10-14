import React, { ReactElement } from 'react'

import { CardBlueprint, getExtensions } from '../../cards/CardBlueprint'

type ExtensionFormsProps = {
  cardBlueprint: CardBlueprint
  updateCard: (cardBlueprint: Partial<CardBlueprint>) => void
}

const ExtensionForms = ({ cardBlueprint, updateCard }: ExtensionFormsProps): ReactElement => (
  <>
    {getExtensions(cardBlueprint).map(({ Component, ...extension }) => (
      <Component
        key={extension.name}
        value={extension.state}
        setValue={value => updateCard({ extensions: value })}
        isValid={extension.isValid(extension.state)}
      />
    ))}
  </>
)

export default ExtensionForms
