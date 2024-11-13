import React, { ReactElement } from 'react'

import { Card, getExtensions } from '../../cards/Card'

type ExtensionFormsProps = {
  card: Card
  updateCard: (card: Partial<Card>) => void
  showRequired: boolean
}

const ExtensionForms = ({ card, updateCard, showRequired }: ExtensionFormsProps): ReactElement => (
  <>
    {getExtensions(card).map(({ extension: { Component, ...extension }, state }) => (
      <Component
        key={extension.name}
        showRequired={showRequired}
        value={state}
        setValue={value => updateCard({ extensions: value })}
        isValid={extension.isValid(state)}
      />
    ))}
  </>
)

export default ExtensionForms
