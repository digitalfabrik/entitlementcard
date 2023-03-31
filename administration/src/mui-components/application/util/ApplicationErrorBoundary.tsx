import localforage from 'localforage'
import { Component, ReactNode } from 'react'
import { applicationStorageKey } from '../ApplyController'
import { globalArrayBuffersKey } from '../../../util/globalArrayBuffersManager'

class ApplicationErrorBoundary extends Component<{ children: ReactNode }, { resetting: boolean }> {
  state = { resetting: false }

  async componentDidCatch() {
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

  render() {
    if (this.state.resetting) return null
    return this.props.children
  }

  static getDerivedStateFromError(error: Error) {
    console.error(
      'An error occurred while rendering the application form. Resetting the stored application state...',
      error
    )
    return { resetting: true }
  }
}

export default ApplicationErrorBoundary
