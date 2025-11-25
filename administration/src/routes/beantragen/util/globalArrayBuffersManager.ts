import localforage from 'localforage'
import { useEffect, useRef, useState } from 'react'

export const globalArrayBuffersKey = 'array-buffers'

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

  has(key: number): boolean {
    return this.arrayBuffers.find(({ key: elementKey }) => key === elementKey) !== undefined
  }

  clearAllExcept(except: Set<number>) {
    this.arrayBuffers = this.arrayBuffers.filter(({ key }) => except.has(key))
    localforage.setItem(globalArrayBuffersKey, this.arrayBuffers)
  }
}

const globalArrayBuffersManager = new ArrayBuffersManager()

export const useInitializeGlobalArrayBuffersManager = (): boolean => {
  const [initialized, setInitialized] = useState(false)
  useEffect(() => {
    globalArrayBuffersManager.initialize().finally(() => setInitialized(true))
  }, [setInitialized])
  return initialized
}

export const useGarbageCollectArrayBuffers = (getUsedArrayBufferKeys: (() => number[]) | null): void => {
  const getUsedArrayBufferKeysRef = useRef(getUsedArrayBufferKeys)

  useEffect(() => {
    getUsedArrayBufferKeysRef.current = getUsedArrayBufferKeys
  }, [getUsedArrayBufferKeys])

  useEffect(() => {
    const interval = setInterval(() => {
      // Collect Garbage
      const getKeys = getUsedArrayBufferKeysRef.current
      if (getKeys !== null) {
        globalArrayBuffersManager.clearAllExcept(new Set(getKeys()))
      }
    }, 2000)
    return () => clearInterval(interval)
  })
}

export default globalArrayBuffersManager
