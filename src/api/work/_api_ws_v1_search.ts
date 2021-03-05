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

export interface SearchOptions {
  /**
   * A string or number used to find related documents
   */
  query?: string
  /**
   * Set to false to not automatically refine the query by keywords
   */
  automatic_query_refinement?: boolean
  /**
   * Paging controls for the result set
   */
  page?: {
    size?: number
    current?: number
  }
  /**
   * Restrict the fulltext search to only specific fields
   */
  search_fields?: {
    [k: string]: {
      weight?: number
    }
  }
  /**
   * Restrict the result fields for each item to the specified fields
   */
  result_fields?: {
    [k: string]: {
      raw?: {
        size?: number
      }
      snippet?: {
        size?: number
        fallback?: boolean
      }
    }
  }
  filters?: null
  sort?:
  | {
    [k: string]: 'asc' | 'desc'
  }
  | Array<{
    [k: string]: 'asc' | 'desc'
  }>
  facets?: {
    [k: string]:
    | Array<| {
      type: 'range'
      name?: string
      ranges: Array<| {
        [k: string]: unknown
      }
      | {
        [k: string]: unknown
      }>
      center?: string | string | string | [number, number]
      unit?: 'm' | 'mi' | 'in' | 'ft' | 'yd' | 'km' | 'cm' | 'mm'
    }
    | {
      type: 'value'
      name?: string
      size?: number
      /**
               * Facet field to sort on and sort by count and/or value
               */
      sort?: {
        count?: 'asc' | 'desc'
        value?: 'asc' | 'desc'
      }
    }>
    | (
      | {
        type: 'range'
        name?: string
        ranges: Array<| {
          [k: string]: unknown
        }
        | {
          [k: string]: unknown
        }>
        center?: string | [number, number]
        unit?: 'm' | 'mi' | 'in' | 'ft' | 'yd' | 'km' | 'cm' | 'mm'
      }
      | {
        type: 'value'
        name?: string
        size?: number
        /**
               * Facet field to sort on and sort by count and/or value
               */
        sort?: {
          count?: 'asc' | 'desc'
          value?: 'asc' | 'desc'
        }
      }
    )
  }
  boosts?: {
    [k: string]:
    | Array<(
      | {
        [k: string]: unknown
      }
      | {
        [k: string]: unknown
      }
    ) &
    (
      | {
        [k: string]: unknown
      }
      | {
        function: 'linear' | 'exponential' | 'logarithmic'
        [k: string]: unknown
      }
    ) &
    (
      | {
        [k: string]: unknown
      }
      | {
        [k: string]: unknown
      }
    )>
    | ((
      | {
        [k: string]: unknown
      }
      | {
        [k: string]: unknown
      }
    ) &
    (
      | {
        [k: string]: unknown
      }
      | {
        function: 'linear' | 'exponential' | 'logarithmic'
        [k: string]: unknown
      }
    ) & {
      [k: string]: unknown
    })
  }
  [k: string]: unknown
}

export interface SearchResponse {
  meta: {
    page: {
      current: number
      total_pages: number
      total_results: number
      size: number
      [k: string]: unknown
    }
    /**
     * Internal request ID for this query instance
     */
    request_id: string
    /**
     * Any warnings that the query generated
     */
    warnings?: string[]
    /**
     * Metadata regarding automatic refinements made to the query
     */
    query_refinements?: {
      submitted_query: string
      decorated_query_html: string
      refinements: Array<{
        /**
         * The term(s) used for the trigger
         */
        term?: string
        /**
         * The start and end position the term(s) exist in the original query
         */
        position?: number[]
        /**
         * The type of trigger created
         */
        trigger_type?: string
        /**
         * The type of filter created from this trigger
         */
        trigger_filter_type?: string
        filter?: {
          [k: string]:
          | ((string | number) | Array<string | number>)
          | {
            /**
                 * A value to filter on
                 */
            from?: string | number
            /**
                 * A value to filter on
                 */
            to?: string | number
          }
          | {
            /**
                 * The base unit of measurement [mm, cm, m (meters), km, in, ft, yd, or mi (miles)]
                 */
            unit: 'm' | 'mi' | 'in' | 'ft' | 'yd' | 'km' | 'cm' | 'mm'
            /**
                 * The mode of the distribution as a "lat, lon" string, "POINT(lon lat)" WKT POINT string, Geohash string, or [lon, lat] array
                 */
            center: string | string | string | [number, number]
            /**
                 * A value to filter on
                 */
            from?: string | number
            /**
                 * A value to filter on
                 */
            to?: string | number
          }
          | {
            /**
                 * The base unit of measurement [mm, cm, m (meters), km, in, ft, yd, or mi (miles)]
                 */
            unit: 'm' | 'mi' | 'in' | 'ft' | 'yd' | 'km' | 'cm' | 'mm'
            /**
                 * The mode of the distribution as a "lat, lon" string, "POINT(lon lat)" WKT POINT string, Geohash string, or [lon, lat] array
                 */
            center: string | string | string | [number, number]
            /**
                 * A number representing the distance unit
                 */
            distance: number
          }
        }
        [k: string]: unknown
      }>
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  results: Array<{
    /**
     * Metadata about this specific result item
     */
    // _meta?: {
    //   source?: string
    //   last_updated?: string
    //   content_source_id?: string
    //   id?: string
    //   score?: number
    //   [k: string]: unknown
    // }
    [k: string]: {
      raw?: string | number
      snippet?: string
      [k: string]: unknown
    }
  }>
  /**
   * facets returned from the query
   */
  facets?:
  | {
    type?: 'value' | 'range'
    /**
         * array of facets and counts for this field
         */
    data?: Array<{
      value?: string | number
      count: number
      key?: string
      from?: string | number
      to?: string | number
      [k: string]: unknown
    }>
    [k: string]: unknown
  }
  | Array<{
    type?: 'value' | 'range'
    /**
         * array of facets and counts for this field
         */
    data?: Array<{
      value?: string | number
      count: number
      key?: string
      from?: string | number
      to?: string | number
      [k: string]: unknown
    }>
    [k: string]: unknown
  }>
  [k: string]: unknown
}

/** Search across available sources with various query tuning options */
export async function search (this: That, opts?: SearchOptions, transportOptions?: TransportRequestOptionsWithOutMeta): Promise<SearchResponse>
export async function search (this: That, opts?: SearchOptions, transportOptions?: TransportRequestOptionsWithMeta): Promise<TransportResult<SearchResponse, unknown>>
export async function search (this: That, opts?: SearchOptions, transportOptions?: TransportRequestOptions): Promise<SearchResponse>
export async function search (this: That, opts?: SearchOptions, transportOptions?: TransportRequestOptions): Promise<any> {
  const params: TransportRequestParams = {
    method: 'POST',
    path: '/api/ws/v1/search',
    querystring: {},
    body: {}
  }

  if (opts?.query !== undefined) (params.body as Record<string, any>).query = opts.query
  if (opts?.automatic_query_refinement !== undefined) (params.body as Record<string, any>).automatic_query_refinement = opts.automatic_query_refinement
  if (opts?.page !== undefined) (params.body as Record<string, any>).page = opts.page
  if (opts?.search_fields !== undefined) (params.body as Record<string, any>).search_fields = opts.search_fields
  if (opts?.result_fields !== undefined) (params.body as Record<string, any>).result_fields = opts.result_fields
  if (opts?.filters !== undefined) (params.body as Record<string, any>).filters = opts.filters
  if (opts?.sort !== undefined) (params.body as Record<string, any>).sort = opts.sort
  if (opts?.facets !== undefined) (params.body as Record<string, any>).facets = opts.facets
  if (opts?.boosts !== undefined) (params.body as Record<string, any>).boosts = opts.boosts

  return await this.transport.request<SearchResponse>(params, transportOptions)
}