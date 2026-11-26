import { type APIRequestContext, type APIResponse } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

export class ImportUsersApi {
  private readonly csvBuffer: Buffer

  constructor(
    private readonly request: APIRequestContext,
    private readonly url: string,
  ) {
    this.csvBuffer = fs.readFileSync(
      path.resolve(import.meta.dirname, '../data/import_userentitlements.csv'),
    )
  }

  async import(token?: string): Promise<APIResponse> {
    return this.postCsvFile(
      this.request,
      this.url,
      this.csvBuffer,
      'import_userentitlements.csv',
      token,
    )
  }

  async importWithHeaders(headers: string, token?: string): Promise<APIResponse> {
    const [, ...dataLines] = this.csvBuffer.toString().split('\n')
    const buffer = Buffer.from([headers, ...dataLines].join('\n'))
    return this.postCsvFile(this.request, this.url, buffer, 'import_userentitlements.csv', token)
  }

  private async postCsvFile(
    request: APIRequestContext,
    url: string,
    buffer: Buffer,
    filename: string,
    token?: string,
  ): Promise<APIResponse> {
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
    const form = new FormData()
    form.append('file', new File([new Uint8Array(buffer)], filename, { type: 'text/csv' }))
    return request.post(url, { headers, multipart: form })
  }
}
