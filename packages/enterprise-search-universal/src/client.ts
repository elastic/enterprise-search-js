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

export interface ClientOptions {
  url: string
  token: string
}

export interface RequestParams {
  method: string
  path: string
  querystring?: Record<string, any>
  body?: Record<string, any>
  headers?: Record<string, any>
  signal?: AbortSignal
}

export default class Client {
  readonly _url: string
  readonly _token: string

  constructor (opts: ClientOptions) {
    this._url = opts.url
    this._token = opts.token
  }

  async transportRequest<T = unknown> (params: RequestParams): Promise<T> {
    const requestOptions: RequestInit = {
      method: params.method,
      headers: new Headers({ authorization: this._token }),
      signal: params.signal
    }

    if (params.body != null && typeof params.body === 'object') {
      requestOptions.body = JSON.stringify(params.body)
      // @ts-expect-error
      requestOptions.headers.set('content-type', 'application/json')
    }

    for (const header in params.headers) {
      // @ts-expect-error
      requestOptions.headers.set(header, params.headers[header])
    }

    const url = new URL(params.path, this._url)
    // this might be a problem as ent-search needs rails-style query parameters
    // invesitgate if URLSearchParams can help here or send everything
    // in the body (can you send GET with body wit fetch?)
    for (const param in params.querystring) {
      url.searchParams.set(param, params.querystring[param])
    }

    const response = await fetch(url.toString(), requestOptions)
    return await response.json()
  }
}
