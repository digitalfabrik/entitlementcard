import localforage from 'localforage'
import { useEffect, useState } from 'react'

const globalArrayBuffersKey = 'array-buffers'

class ArrayBuffersManager {
  private arrayBuffers: { key: number; value: ArrayBuffer }[] = []

  async initialize() {
    const arrayBuffers = await localforage.getItem<{ key: number; value: ArrayBuffer }[]>(globalArrayBuffersKey)
    if (arrayBuffers !== null) {
      this.arrayBuffers = arrayBuffers
    }
  }

  getArrayBufferByKey(key: number): ArrayBuffer {
    const element = this.arrayBuffers.find(({ key: elementKey }) => key === elementKey)
    if (element === undefined) {
      throw Error('Invalid index')
    }
    return element.value
  }

  addArrayBuffer(arrayBuffer: ArrayBuffer): number {
    const newKey = Math.max(...this.arrayBuffers.map(({ key }) => key), 0) + 1
    this.arrayBuffers.push({ key: newKey, value: arrayBuffer })
    localforage.setItem(globalArrayBuffersKey, this.arrayBuffers)
    return newKey
  }

  removeArrayBufferByKey(key: number): void {
    this.arrayBuffers = this.arrayBuffers.filter(({ key: elementKey }) => key !== elementKey)
    localforage.setItem(globalArrayBuffersKey, this.arrayBuffers)
  }

  has(key: number): boolean {
    return this.arrayBuffers.find(({ key: elementKey }) => key === elementKey) !== undefined
  }
}

const globalArrayBuffersManager = new ArrayBuffersManager()

export const useInitializeGlobalArrayBuffersManager = () => {
  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    globalArrayBuffersManager.initialize().finally(() => setInitialized(true))
  }, [setInitialized])
  return initialized
}

export default globalArrayBuffersManager
