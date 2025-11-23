import { ReactElement } from 'react'

import { Card, getExtensions } from '../../cards/Card'

type ExtensionFormsProps = {
  card: Card
  updateCard: (card: Partial<Card>) => void
  forceError: boolean
}

const ExtensionForms = ({ card, updateCard, forceError }: ExtensionFormsProps): ReactElement => (
  <>
    {getExtensions(card).map(({ extension: { Component, ...extension }, state }) => (
      <Component
        key={extension.name}
        forceError={forceError}
        value={state}
        setValue={value => updateCard({ extensions: value })}
        isValid={extension.isValid(state)}
      />
    ))}
  </>
)

export default ExtensionForms
