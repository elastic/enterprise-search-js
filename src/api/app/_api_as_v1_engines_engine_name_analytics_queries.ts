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

export interface GetTopQueriesAnalyticsOptions {
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
  /**
   * Analytics filters
   */
  filters?: Array<{
    [k: string]: unknown
  }>
  [k: string]: unknown
}

export interface GetTopQueriesAnalyticsResponse {
  [k: string]: unknown
}

/** Returns queries analytics by usage count */
export async function getTopQueriesAnalytics (this: That, opts: GetTopQueriesAnalyticsOptions, transportOptions?: TransportRequestOptionsWithOutMeta): Promise<GetTopQueriesAnalyticsResponse>
export async function getTopQueriesAnalytics (this: That, opts: GetTopQueriesAnalyticsOptions, transportOptions?: TransportRequestOptionsWithMeta): Promise<TransportResult<GetTopQueriesAnalyticsResponse, unknown>>
export async function getTopQueriesAnalytics (this: That, opts: GetTopQueriesAnalyticsOptions, transportOptions?: TransportRequestOptions): Promise<GetTopQueriesAnalyticsResponse>
export async function getTopQueriesAnalytics (this: That, opts: GetTopQueriesAnalyticsOptions, transportOptions?: TransportRequestOptions): Promise<any> {
  const params: TransportRequestParams = {
    method: 'GET',
    path: `/api/as/v1/engines/${encodeURIComponent(opts.engine_name)}/analytics/queries`,
    querystring: {}
  }

  if (opts.currentPage !== undefined) (params.querystring as Record<string, any>).currentPage = opts.currentPage
  if (opts.pageSize !== undefined) (params.querystring as Record<string, any>).pageSize = opts.pageSize
  if (opts.filters !== undefined) (params.querystring as Record<string, any>).filters = opts.filters

  return await this.transport.request<GetTopQueriesAnalyticsResponse>(params, transportOptions)
}