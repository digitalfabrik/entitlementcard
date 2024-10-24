import React, { ReactElement } from 'react'

import { Card, getExtensions } from '../../cards/Card'

type ExtensionFormsProps = {
  card: Card
  updateCard: (card: Partial<Card>) => void
}

const ExtensionForms = ({ card, updateCard }: ExtensionFormsProps): ReactElement => (
  <>
    {getExtensions(card).map(({ extension: { Component, ...extension }, state }) => (
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
