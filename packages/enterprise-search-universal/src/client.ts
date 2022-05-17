/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* eslint-disable @typescript-eslint/naming-convention */

import type * as AppTypes from './app-types'
import type * as WorkTypes from './workplace-types'

const clientVersion = '8.1'
const jsVersion = typeof window !== 'undefined'
  ? 'browser'
  : process.versions.node

export interface ClientOptions {
  url: string
  token: string
  enableMetaHeader?: boolean
}

export interface RequestParams {
  method: string
  path: string
  querystring?: Record<string, any>
  body?: Record<string, any>
}

export interface RequestOptions {
  headers?: Record<string, string>
  signal?: AbortSignal
}

type TransportRequest = <T = unknown>(params: RequestParams, options?: RequestOptions) => Promise<T>

export class ResponseError extends Error {
  statusCode: number
  body: any
  constructor (message: string, statusCode: number, body: any) {
    if (typeof body === 'string') {
      message = body
    }
    super(message)
    this.name = 'EnteropriseSearchClientError'
    this.statusCode = statusCode
    this.body = body
  }
}

export class Client {
  readonly _url: string
  readonly _token: string
  readonly _metaHeader: string | undefined
  readonly app: AppSearchClient
  readonly workplace: WorkplaceSearchClient

  constructor (opts: ClientOptions) {
    this._url = opts.url
    this._token = opts.token
    this.app = new AppSearchClient(this.transportRequest.bind(this))
    this.workplace = new WorkplaceSearchClient(this.transportRequest.bind(this))
    if (opts.enableMetaHeader === true || opts.enableMetaHeader == null) {
      this._metaHeader = `ent=${clientVersion},js=${jsVersion},t=${clientVersion},ft=universal`
    }
  }

  async transportRequest<T = unknown> (params: RequestParams, options?: RequestOptions): Promise<T> {
    const requestOptions: RequestInit = {
      method: params.method,
      headers: new Headers({ authorization: this._token }),
      signal: options?.signal
    }

    if (this._metaHeader != null) {
      // @ts-expect-error
      requestOptions.headers.set('x-elastic-client-meta', this._metaHeader)
    }

    if (params.body != null && typeof params.body === 'object') {
      requestOptions.body = JSON.stringify(params.body)
      // @ts-expect-error
      requestOptions.headers.set('content-type', 'application/json')
    }

    for (const header in options?.headers) {
      // @ts-expect-error
      requestOptions.headers.set(header, options.headers[header])
    }

    const url = new URL(params.path, this._url)
    for (const param in params.querystring) {
      if (Array.isArray(params.querystring[param])) {
        for (const element of params.querystring[param]) {
          url.searchParams.append(`${param}[]`, element)
        }
      } else if (typeof params.querystring[param] === 'object' && params.querystring[param] !== null) {
        // it only works for flat objects
        for (const key in params.querystring[param]) {
          url.searchParams.append(`${param}[${key}]`, params.querystring[param][key])
        }
      } else {
        url.searchParams.set(param, params.querystring[param])
      }
    }

    const response = await fetch(url.toString(), requestOptions)
    let body = await response.text()
    if (response.headers.get('content-type')?.includes('json') === true && body !== '') {
      body = JSON.parse(body)
    }

    if (!response.ok) {
      throw new ResponseError('Response error', response.status, body)
    }

    // @ts-expect-error
    return body
  }
}

class AppSearchClient {
  transportRequest: TransportRequest
  constructor (transportRequest: TransportRequest) {
    this.transportRequest = transportRequest
  }

  async logClickthrough (params: AppTypes.LogClickthroughRequest, options?: RequestOptions): Promise<AppTypes.LogClickthroughResponse> {
    const {
      engine_name,
      body,
      ...querystring
    } = params ?? {}
    return await this.transportRequest<AppTypes.LogClickthroughResponse>({
      method: 'POST',
      path: `/api/as/v1/engines/${engine_name}/click`,
      querystring,
      body: body
    }, options)
  }

  async querySuggestion (params: AppTypes.QuerySuggestionRequest, options?: RequestOptions): Promise<AppTypes.QuerySuggestionResponse> {
    const {
      engine_name,
      body,
      ...querystring
    } = params ?? {}
    return await this.transportRequest<AppTypes.QuerySuggestionResponse>({
      method: 'POST',
      path: `/api/as/v1/engines/${engine_name}/query_suggestion`,
      querystring,
      body: body
    }, options)
  }

  async search (params: AppTypes.SearchRequest, options?: RequestOptions): Promise<AppTypes.SearchResponse> {
    const {
      engine_name,
      body,
      ...querystring
    } = params ?? {}
    return await this.transportRequest<AppTypes.SearchResponse>({
      method: 'POST',
      path: `/api/as/v1/engines/${engine_name}/search`,
      querystring,
      body: body
    }, options)
  }
}

class WorkplaceSearchClient {
  transportRequest: TransportRequest
  constructor (transportRequest: TransportRequest) {
    this.transportRequest = transportRequest
  }

  async getTriggersBlocklist (params?: WorkTypes.GetTriggersBlocklistRequest, options?: RequestOptions): Promise<WorkTypes.GetTriggersBlocklistResponse> {
    return await this.transportRequest<WorkTypes.GetTriggersBlocklistResponse>({
      method: 'GET',
      path: '/api/ws/v1/automatic_query_refinement'
    }, options)
  }

  async putTriggersBlocklist (params?: WorkTypes.PutTriggersBlocklistRequest, options?: RequestOptions): Promise<WorkTypes.PutTriggersBlocklistResponse> {
    const {
      ...querystring
    } = params ?? {}
    return await this.transportRequest<WorkTypes.PutTriggersBlocklistResponse>({
      method: 'PUT',
      path: '/api/ws/v1/automatic_query_refinement',
      querystring
    }, options)
  }

  async createAnalyticsEvent (params: WorkTypes.CreateAnalyticsEventRequest, options?: RequestOptions): Promise<WorkTypes.CreateAnalyticsEventResponse> {
    const {
      body,
      ...querystring
    } = params ?? {}
    return await this.transportRequest<WorkTypes.CreateAnalyticsEventResponse>({
      method: 'POST',
      path: '/api/ws/v1/analytics/event',
      querystring,
      body: body
    }, options)
  }

  async search (params: WorkTypes.SearchRequest, options?: RequestOptions): Promise<WorkTypes.SearchResponse> {
    const {
      body,
      ...querystring
    } = params ?? {}
    return await this.transportRequest<WorkTypes.SearchResponse>({
      method: 'POST',
      path: '/api/ws/v1/search',
      querystring,
      body: body
    }, options)
  }
}
