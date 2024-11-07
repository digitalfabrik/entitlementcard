import { RenderOptions, RenderResult, render } from '@testing-library/react'
import React, { ReactElement, ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'

export const renderWithRouter = (ui: ReactElement, options?: RenderOptions): RenderResult => {
  const CustomWrapper = options?.wrapper
  const wrapper = CustomWrapper
    ? (props: { children: ReactNode }) => (
        <MemoryRouter>
          <CustomWrapper {...props} />
        </MemoryRouter>
      )
    : MemoryRouter
  return render(ui, { wrapper })
}
