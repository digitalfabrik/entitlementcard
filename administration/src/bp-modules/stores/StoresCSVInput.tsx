import { Icon, NonIdealState, NonIdealStateIconSize } from '@blueprintjs/core'
import { parse } from 'csv-parse/browser/esm/sync'
import { FeatureCollection, GeoJSON, Point } from 'geojson'
import React, { ChangeEventHandler, ReactElement, useCallback, useRef } from 'react'
import styled from 'styled-components'

import {
  FIELD_HOUSE_NUMBER,
  FIELD_LATITUDE,
  FIELD_LOCATION,
  FIELD_LONGITUDE,
  FIELD_NAME,
  FIELD_POSTAL_CODE,
  FIELD_STREET,
} from '../../project-configs/constants'
import { StoreFieldConfig } from '../../project-configs/getProjectConfig'
import geoDataUrlWithParams from '../../project-configs/helper/getGeoDataUrlWithParams'
import { useAppToaster } from '../AppToaster'
import { AcceptingStoreEntry } from './AcceptingStoreEntry'
import { StoreData } from './StoresImportController'
import StoresRequirementsText from './StoresRequirementsText'

const StoreImportInputContainer = styled.div`
  display: flex;
  align-items: center;
`

const InputContainer = styled(NonIdealState)`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
`
type StoresCsvInputProps = {
  setAcceptingStores: (store: AcceptingStoreEntry[]) => void
  fields: StoreFieldConfig[]
  setIsLoadingCoordinates: (value: boolean) => void
}

export const DEFAULT_ERROR_TIMEOUT = 3000
export const LONG_ERROR_TIMEOUT = 10000
export const FILE_SIZE_LIMIT_MEGA_BYTES = 2
const defaultExtensionsByMIMEType = {
  'text/csv': '.csv',
}
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MEGA_BYTES * 1000 * 1000

const lineToStoreEntry = (line: string[], headers: string[], fields: StoreFieldConfig[]): AcceptingStoreEntry => {
  const storeData = line.reduce((acc, entry, index) => {
    const columnName = headers[index]
    return { ...acc, [columnName]: entry }
  }, {})
  return new AcceptingStoreEntry(storeData, fields)
}

const hasStoreDuplicates = (stores: AcceptingStoreEntry[]) => {
  return (
    new Set(
      stores.map(({ data }: { data: StoreData }) =>
        JSON.stringify([
          data[FIELD_NAME],
          data[FIELD_STREET],
          data[FIELD_HOUSE_NUMBER],
          data[FIELD_POSTAL_CODE],
          data[FIELD_LOCATION],
        ])
      )
    ).size < stores.length
  )
}

const getStoreCoordinates = (
  stores: AcceptingStoreEntry[],
  showInputError: (message: string, timeout?: number) => void
): (AcceptingStoreEntry | Promise<AcceptingStoreEntry>)[] =>
  stores.map((store, index) => {
    if (store.hasValidCoordinates()) return store
    const isMissingLocationInformation =
      store.data[FIELD_LOCATION].length === 0 ||
      store.data[FIELD_STREET].length === 0 ||
      store.data[FIELD_HOUSE_NUMBER].length === 0
    if (isMissingLocationInformation) {
      showInputError(
        `Eintrag ${
          index + 1
        }: Es sind nicht alle notwendigen Adressdaten vorhanden, um die notwendigen Geodaten abzurufen`,
        LONG_ERROR_TIMEOUT
      )
      return store
    }
    return fetch(
      geoDataUrlWithParams(store.data[FIELD_LOCATION], store.data[FIELD_STREET], store.data[FIELD_HOUSE_NUMBER]).href
    )
      .then(response => response.json())
      .then(({ features }: FeatureCollection<Point, GeoJSON>) => {
        if (res.features.length === 0) {
          showInputError(
            `Eintrag ${index + 1}: Keine passenden Geodaten gefunden! Bitte prüfen sie die Adresse.`,
            LONG_ERROR_TIMEOUT
          )
          return store
        }
        const feature = res.features[0]
        const updatedStore = store
        updatedStore.data[FIELD_LONGITUDE] = feature.geometry.coordinates[0].toString()
        updatedStore.data[FIELD_LATITUDE] = feature.geometry.coordinates[1].toString()
        return updatedStore
      })
    )
  })

const StoresCsvInput = ({ setAcceptingStores, fields, setIsLoadingCoordinates }: StoresCsvInputProps): ReactElement => {
  const fileInput = useRef<HTMLInputElement>(null)
  const appToaster = useAppToaster()
  const headers = fields.map(field => field.name)

  const showInputError = useCallback(
    (message: string, timeout = DEFAULT_ERROR_TIMEOUT) => {
      appToaster?.show({ intent: 'danger', message, timeout })

      if (!fileInput.current) return
      fileInput.current.value = ''
    },
    [appToaster]
  )

  const onLoadEnd = useCallback(
    (event: ProgressEvent<FileReader>) => {
      const content = event.target?.result as string
      let lines: [][] = []
      try {
        lines = parse(content, {
          delimiter: ',',
          encoding: 'utf-8',
        })
      } catch (error) {
        if (error instanceof Error && error.message.includes('line')) {
          showInputError(
            `Keine gültige CSV Datei. Nicht jede Reihe enthält gleich viele Spalten. (Fehler in Zeile ${error.message
              .split('line')[1]
              .trim()})`,
            LONG_ERROR_TIMEOUT
          )
          return
        }
        showInputError('Beim Verarbeiten der Datei ist ein unbekannter Fehler aufgetreten')
        return
      }
      const numberOfColumns = lines[0]?.length

      if (!numberOfColumns) {
        showInputError('Die gewählte Datei ist leer.')
        return
      }

      if (lines.length < 2) {
        showInputError('Die Datei muss mindestens einen Eintrag enthalten.')
        return
      }

      if (lines.some((line: string[]) => line.length !== headers.length)) {
        showInputError(`Die CSV enthält eine ungültige Anzahl an Spalten.`)
        return
      }

      const csvHeader = lines.shift() ?? []

      if (csvHeader.toString() !== headers.toString()) {
        showInputError(`Die erforderlichen Spalten sind nicht vorhanden oder nicht in der richtigen Reihenfolge.`)
        return
      }
      const acceptingStores = lines.map((line: string[]) => lineToStoreEntry(line, csvHeader, fields))

      if (hasStoreDuplicates(acceptingStores)) {
        showInputError(`Die CSV enthält doppelte Einträge.`)
        return
      }
      setIsLoadingCoordinates(true)
      Promise.all(getStoreCoordinates(acceptingStores, showInputError))
        .then(updatedStores => setAcceptingStores(updatedStores))
        .catch(() => {
          showInputError('Fehler beim Abrufen der fehlenden Koordinaten!')
          setAcceptingStores(acceptingStores)
        })
        .finally(() => setIsLoadingCoordinates(false))
    },
    [showInputError, setAcceptingStores, headers, fields]
  )

  const onInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    if (!event.currentTarget?.files) {
      return
    }
    const reader = new FileReader()
    reader.onloadend = onLoadEnd

    const file = event.currentTarget.files[0]
    if (!(file.type in defaultExtensionsByMIMEType)) {
      showInputError('Die gewählte Datei hat einen unzulässigen Dateityp.')
      return
    }

    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      showInputError('Die ausgewählete Datei ist zu groß.')
      return
    }
    reader.readAsText(file)
  }

  return (
    <InputContainer
      title='Wählen Sie eine Datei'
      icon={<Icon intent='warning' size={NonIdealStateIconSize.STANDARD} icon={'upload'} />}
      description={<StoresRequirementsText header={headers} />}
      action={
        <StoreImportInputContainer>
          <input
            data-testid='store-file-upload'
            ref={fileInput}
            accept='.csv, text/csv'
            type='file'
            onInput={onInputChange}
          />
        </StoreImportInputContainer>
      }
    />
  )
}

export default StoresCsvInput
