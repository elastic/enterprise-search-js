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

/* eslint-disable @typescript-eslint/no-empty-interface */

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

export interface DeleteSynonymSetOptions {
  /**
   * Name of the engine
   */
  engine_name: string
  /**
   * Synonym set ID
   */
  synonym_set_id: string
}

export interface DeleteSynonymSetResponse {}

/** Delete a synonym set by ID */
export async function deleteSynonymSet (this: That, opts: DeleteSynonymSetOptions, transportOptions?: TransportRequestOptionsWithOutMeta): Promise<DeleteSynonymSetResponse>
export async function deleteSynonymSet (this: That, opts: DeleteSynonymSetOptions, transportOptions?: TransportRequestOptionsWithMeta): Promise<TransportResult<DeleteSynonymSetResponse, unknown>>
export async function deleteSynonymSet (this: That, opts: DeleteSynonymSetOptions, transportOptions?: TransportRequestOptions): Promise<DeleteSynonymSetResponse>
export async function deleteSynonymSet (this: That, opts: DeleteSynonymSetOptions, transportOptions?: TransportRequestOptions): Promise<any> {
  const params: TransportRequestParams = {
    method: 'DELETE',
    path: `/api/as/v1/engines/${encodeURIComponent(opts.engine_name)}/synonyms/${encodeURIComponent(opts.synonym_set_id)}`,
    querystring: {},
    body: {}
  }

  return await this.transport.request<DeleteSynonymSetResponse>(params, transportOptions)
}

export interface GetSynonymSetOptions {
  /**
   * Name of the engine
   */
  engine_name: string
  /**
   * Synonym set ID
   */
  synonym_set_id: string
}

export interface GetSynonymSetResponse {}

/** Retrieve a synonym set by ID */
export async function getSynonymSet (this: That, opts: GetSynonymSetOptions, transportOptions?: TransportRequestOptionsWithOutMeta): Promise<GetSynonymSetResponse>
export async function getSynonymSet (this: That, opts: GetSynonymSetOptions, transportOptions?: TransportRequestOptionsWithMeta): Promise<TransportResult<GetSynonymSetResponse, unknown>>
export async function getSynonymSet (this: That, opts: GetSynonymSetOptions, transportOptions?: TransportRequestOptions): Promise<GetSynonymSetResponse>
export async function getSynonymSet (this: That, opts: GetSynonymSetOptions, transportOptions?: TransportRequestOptions): Promise<any> {
  const params: TransportRequestParams = {
    method: 'GET',
    path: `/api/as/v1/engines/${encodeURIComponent(opts.engine_name)}/synonyms/${encodeURIComponent(opts.synonym_set_id)}`,
    querystring: {}
  }

  return await this.transport.request<GetSynonymSetResponse>(params, transportOptions)
}

export interface PutSynonymSetOptions {
  /**
   * Name of the engine
   */
  engine_name: string
  /**
   * Synonym set ID
   */
  synonym_set_id: string
  synonyms: string[]
}

export interface PutSynonymSetResponse {}

/** Update a synonym set by ID */
export async function putSynonymSet (this: That, opts: PutSynonymSetOptions, transportOptions?: TransportRequestOptionsWithOutMeta): Promise<PutSynonymSetResponse>
export async function putSynonymSet (this: That, opts: PutSynonymSetOptions, transportOptions?: TransportRequestOptionsWithMeta): Promise<TransportResult<PutSynonymSetResponse, unknown>>
export async function putSynonymSet (this: That, opts: PutSynonymSetOptions, transportOptions?: TransportRequestOptions): Promise<PutSynonymSetResponse>
export async function putSynonymSet (this: That, opts: PutSynonymSetOptions, transportOptions?: TransportRequestOptions): Promise<any> {
  const params: TransportRequestParams = {
    method: 'PUT',
    path: `/api/as/v1/engines/${encodeURIComponent(opts.engine_name)}/synonyms/${encodeURIComponent(opts.synonym_set_id)}`,
    querystring: {},
    body: {}
  }

  if (opts.synonyms !== undefined) (params.body as Record<string, any>).synonyms = opts.synonyms

  return await this.transport.request<PutSynonymSetResponse>(params, transportOptions)
}
