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

// This file was automatically generated by elastic/elastic-client-generator-js
// DO NOT MODIFY IT BY HAND. Instead, modify the source open api file,
// and elastic/elastic-client-generator-js to regenerate this file again.

import {
  Transport,
  TransportRequestParams,
  TransportRequestOptions,
  TransportRequestOptionsWithMeta,
  TransportRequestOptionsWithOutMeta,
  TransportResult
} from '@elastic/transport'
interface That { transport: Transport }

export interface ListCurationsOptions {
  /**
   * Name of the engine
   */
  engine_name: string
  /**
   * The page to fetch. Defaults to 1
   */
  currentPage?: number
  /**
   * The number of results per page
   */
  pageSize?: number
  [k: string]: unknown
}

export interface ListCurationsResponse {
  [k: string]: unknown
}

/** Retrieve available curations for the engine */
export async function listCurations (this: That, opts: ListCurationsOptions, transportOptions?: TransportRequestOptionsWithOutMeta): Promise<ListCurationsResponse>
export async function listCurations (this: That, opts: ListCurationsOptions, transportOptions?: TransportRequestOptionsWithMeta): Promise<TransportResult<ListCurationsResponse, unknown>>
export async function listCurations (this: That, opts: ListCurationsOptions, transportOptions?: TransportRequestOptions): Promise<ListCurationsResponse>
export async function listCurations (this: That, opts: ListCurationsOptions, transportOptions?: TransportRequestOptions): Promise<any> {
  const params: TransportRequestParams = {
    method: 'GET',
    path: `/api/as/v1/engines/${encodeURIComponent(opts.engine_name)}/curations`,
    querystring: {}
  }

  if (opts.currentPage !== undefined) (params.querystring as Record<string, any>).currentPage = opts.currentPage
  if (opts.pageSize !== undefined) (params.querystring as Record<string, any>).pageSize = opts.pageSize

  return await this.transport.request<ListCurationsResponse>(params, transportOptions)
}

export interface CreateCurationOptions {
  /**
   * Name of the engine
   */
  engine_name: string
  /**
   * List of affected search queries
   */
  queries: string[]
  /**
   * List of promoted document IDs
   */
  promotedDocIds?: string[]
  /**
   * List of hidden document IDs
   */
  hiddenDocIds?: string[]
  [k: string]: unknown
}

export interface CreateCurationResponse {
  [k: string]: unknown
}

/** Create a new curation */
export async function createCuration (this: That, opts: CreateCurationOptions, transportOptions?: TransportRequestOptionsWithOutMeta): Promise<CreateCurationResponse>
export async function createCuration (this: That, opts: CreateCurationOptions, transportOptions?: TransportRequestOptionsWithMeta): Promise<TransportResult<CreateCurationResponse, unknown>>
export async function createCuration (this: That, opts: CreateCurationOptions, transportOptions?: TransportRequestOptions): Promise<CreateCurationResponse>
export async function createCuration (this: That, opts: CreateCurationOptions, transportOptions?: TransportRequestOptions): Promise<any> {
  const params: TransportRequestParams = {
    method: 'POST',
    path: `/api/as/v1/engines/${encodeURIComponent(opts.engine_name)}/curations`,
    querystring: {},
    body: {}
  }

  if (opts.queries !== undefined) (params.querystring as Record<string, any>).queries = opts.queries
  if (opts.promotedDocIds !== undefined) (params.querystring as Record<string, any>).promotedDocIds = opts.promotedDocIds
  if (opts.hiddenDocIds !== undefined) (params.querystring as Record<string, any>).hiddenDocIds = opts.hiddenDocIds

  return await this.transport.request<CreateCurationResponse>(params, transportOptions)
}