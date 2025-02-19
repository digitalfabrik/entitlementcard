import localforage from 'localforage'
import { Component, ReactNode } from 'react'

import { applicationStorageKey } from './constants'
import { globalArrayBuffersKey } from './util/globalArrayBuffersManager'

class ApplicationErrorBoundary extends Component<{ children: ReactNode }, { resetting: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { resetting: false }
  }

  async componentDidCatch(): Promise<void> {
    this.setState({ resetting: true })
    try {
      await localforage.removeItem(applicationStorageKey)
      await localforage.removeItem(globalArrayBuffersKey)
    } catch (e) {
      console.error('Another error occurred while resetting the application state.', e)
    } finally {
      this.setState({ resetting: false })
    }
  }

  render(): ReactNode {
    const { children } = this.props
    const { resetting } = this.state
    if (resetting) {
      return null
    }
    return children
  }

  static getDerivedStateFromError(error: Error): { resetting: boolean } {
    console.error(
      'An error occurred while rendering the application form. Resetting the stored application state...',
      error
    )
    return { resetting: true }
  }
}

export default ApplicationErrorBoundary
