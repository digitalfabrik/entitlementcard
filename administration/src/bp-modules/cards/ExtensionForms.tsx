import React, { ReactElement } from 'react'

import { CardBlueprint, getExtensions } from '../../cards/CardBlueprint'

type ExtensionFormsProps = {
  cardBlueprint: CardBlueprint
  updateCard: (cardBlueprint: Partial<CardBlueprint>) => void
}

const ExtensionForms = ({ cardBlueprint, updateCard }: ExtensionFormsProps): ReactElement => (
  <>
    {getExtensions(cardBlueprint).map(({ extension: { Component, ...extension }, state }) => (
      <Component
        key={extension.name}
        value={state}
        setValue={value => updateCard({ extensions: value })}
        isValid={extension.isValid(state)}
      />
    ))}
  </>
)

export default ExtensionForms
