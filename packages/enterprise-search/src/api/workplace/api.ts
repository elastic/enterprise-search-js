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
/* eslint-disable @typescript-eslint/no-empty-interface */

// This file was automatically generated by elastic/elastic-client-generator-js
// DO NOT MODIFY IT BY HAND. Instead, modify the source open api file,
// and elastic/elastic-client-generator-js to regenerate this file again.

import {
  Transport,
  TransportRequestOptions
} from '@elastic/transport'
import * as T from './types'
interface That { transport: Transport }

export default class API {
  async createContentSource (this: That, params: T.CreateContentSourceRequest, options?: TransportRequestOptions): Promise<T.CreateContentSourceResponse> {
    const {
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.CreateContentSourceResponse>({
      method: 'POST',
      path: '/api/ws/v1/sources',
      querystring,
      body: body
    }, options)
  }

  async listContentSources (this: That, params?: T.ListContentSourcesRequest, options?: TransportRequestOptions): Promise<T.ListContentSourcesResponse> {
    const {
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.ListContentSourcesResponse>({
      method: 'GET',
      path: '/api/ws/v1/sources',
      querystring
    }, options)
  }

  async getContentSource (this: That, params: T.GetContentSourceRequest, options?: TransportRequestOptions): Promise<T.GetContentSourceResponse> {
    const {
      content_source_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.GetContentSourceResponse>({
      method: 'GET',
      path: `/api/ws/v1/sources/${content_source_id}`,
      querystring
    }, options)
  }

  async putContentSource (this: That, params: T.PutContentSourceRequest, options?: TransportRequestOptions): Promise<T.PutContentSourceResponse> {
    const {
      content_source_id,
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.PutContentSourceResponse>({
      method: 'PUT',
      path: `/api/ws/v1/sources/${content_source_id}`,
      querystring,
      body: body
    }, options)
  }

  async deleteContentSource (this: That, params: T.DeleteContentSourceRequest, options?: TransportRequestOptions): Promise<T.DeleteContentSourceResponse> {
    const {
      content_source_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.DeleteContentSourceResponse>({
      method: 'DELETE',
      path: `/api/ws/v1/sources/${content_source_id}`,
      querystring
    }, options)
  }

  async putContentSourceIcons (this: That, params: T.PutContentSourceIconsRequest, options?: TransportRequestOptions): Promise<T.PutContentSourceIconsResponse> {
    const {
      content_source_id,
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.PutContentSourceIconsResponse>({
      method: 'PUT',
      path: `/api/ws/v1/sources/${content_source_id}/icon`,
      querystring,
      body: body
    }, options)
  }

  async deleteDocumentsByQuery (this: That, params: T.DeleteDocumentsByQueryRequest, options?: TransportRequestOptions): Promise<T.DeleteDocumentsByQueryResponse> {
    const {
      content_source_id,
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.DeleteDocumentsByQueryResponse>({
      method: 'DELETE',
      path: `/api/ws/v1/sources/${content_source_id}/documents`,
      querystring,
      body: body
    }, options)
  }

  async listDocuments (this: That, params: T.ListDocumentsRequest, options?: TransportRequestOptions): Promise<T.ListDocumentsResponse> {
    const {
      content_source_id,
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.ListDocumentsResponse>({
      method: 'POST',
      path: `/api/ws/v1/sources/${content_source_id}/documents`,
      querystring,
      body: body
    }, options)
  }

  async indexDocuments (this: That, params: T.IndexDocumentsRequest, options?: TransportRequestOptions): Promise<T.IndexDocumentsResponse> {
    const {
      content_source_id,
      documents,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.IndexDocumentsResponse>({
      method: 'POST',
      path: `/api/ws/v1/sources/${content_source_id}/documents/bulk_create`,
      querystring,
      body: documents
    }, options)
  }

  async deleteDocuments (this: That, params: T.DeleteDocumentsRequest, options?: TransportRequestOptions): Promise<T.DeleteDocumentsResponse> {
    const {
      content_source_id,
      document_ids,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.DeleteDocumentsResponse>({
      method: 'POST',
      path: `/api/ws/v1/sources/${content_source_id}/documents/bulk_destroy`,
      querystring,
      body: document_ids
    }, options)
  }

  async getDocument (this: That, params: T.GetDocumentRequest, options?: TransportRequestOptions): Promise<T.GetDocumentResponse> {
    const {
      content_source_id,
      document_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.GetDocumentResponse>({
      method: 'GET',
      path: `/api/ws/v1/sources/${content_source_id}/documents/${document_id}`,
      querystring
    }, options)
  }

  async listExternalIdentities (this: That, params: T.ListExternalIdentitiesRequest, options?: TransportRequestOptions): Promise<T.ListExternalIdentitiesResponse> {
    const {
      content_source_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.ListExternalIdentitiesResponse>({
      method: 'GET',
      path: `/api/ws/v1/sources/${content_source_id}/external_identities`,
      querystring
    }, options)
  }

  async createExternalIdentity (this: That, params: T.CreateExternalIdentityRequest, options?: TransportRequestOptions): Promise<T.CreateExternalIdentityResponse> {
    const {
      content_source_id,
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.CreateExternalIdentityResponse>({
      method: 'POST',
      path: `/api/ws/v1/sources/${content_source_id}/external_identities`,
      querystring,
      body: body
    }, options)
  }

  async getExternalIdentity (this: That, params: T.GetExternalIdentityRequest, options?: TransportRequestOptions): Promise<T.GetExternalIdentityResponse> {
    const {
      content_source_id,
      external_user_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.GetExternalIdentityResponse>({
      method: 'GET',
      path: `/api/ws/v1/sources/${content_source_id}/external_identities/${external_user_id}`,
      querystring
    }, options)
  }

  async putExternalIdentity (this: That, params: T.PutExternalIdentityRequest, options?: TransportRequestOptions): Promise<T.PutExternalIdentityResponse> {
    const {
      content_source_id,
      external_user_id,
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.PutExternalIdentityResponse>({
      method: 'PUT',
      path: `/api/ws/v1/sources/${content_source_id}/external_identities/${external_user_id}`,
      querystring,
      body: body
    }, options)
  }

  async deleteExternalIdentity (this: That, params: T.DeleteExternalIdentityRequest, options?: TransportRequestOptions): Promise<T.DeleteExternalIdentityResponse> {
    const {
      content_source_id,
      external_user_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.DeleteExternalIdentityResponse>({
      method: 'DELETE',
      path: `/api/ws/v1/sources/${content_source_id}/external_identities/${external_user_id}`,
      querystring
    }, options)
  }

  async commandSyncJobs (this: That, params: T.CommandSyncJobsRequest, options?: TransportRequestOptions): Promise<T.CommandSyncJobsResponse> {
    const {
      content_source_id,
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.CommandSyncJobsResponse>({
      method: 'POST',
      path: `/api/ws/v1/sources/${content_source_id}/sync/jobs`,
      querystring,
      body: body
    }, options)
  }

  async getSynonymSet (this: That, params: T.GetSynonymSetRequest, options?: TransportRequestOptions): Promise<T.GetSynonymSetResponse> {
    const {
      synonym_set_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.GetSynonymSetResponse>({
      method: 'GET',
      path: `/api/ws/v1/synonyms/${synonym_set_id}`,
      querystring
    }, options)
  }

  async putSynonymSet (this: That, params: T.PutSynonymSetRequest, options?: TransportRequestOptions): Promise<T.PutSynonymSetResponse> {
    const {
      synonym_set_id,
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.PutSynonymSetResponse>({
      method: 'PUT',
      path: `/api/ws/v1/synonyms/${synonym_set_id}`,
      querystring,
      body: body
    }, options)
  }

  async deleteSynonymSet (this: That, params: T.DeleteSynonymSetRequest, options?: TransportRequestOptions): Promise<T.DeleteSynonymSetResponse> {
    const {
      synonym_set_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.DeleteSynonymSetResponse>({
      method: 'DELETE',
      path: `/api/ws/v1/synonyms/${synonym_set_id}`,
      querystring
    }, options)
  }

  async listSynonymSets (this: That, params?: T.ListSynonymSetsRequest, options?: TransportRequestOptions): Promise<T.ListSynonymSetsResponse> {
    const {
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.ListSynonymSetsResponse>({
      method: 'GET',
      path: '/api/ws/v1/synonyms',
      querystring,
      body: body
    }, options)
  }

  async createBatchSynonymSets (this: That, params: T.CreateBatchSynonymSetsRequest, options?: TransportRequestOptions): Promise<T.CreateBatchSynonymSetsResponse> {
    const {
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.CreateBatchSynonymSetsResponse>({
      method: 'POST',
      path: '/api/ws/v1/synonyms',
      querystring,
      body: body
    }, options)
  }

  async getTriggersBlocklist (this: That, params?: T.GetTriggersBlocklistRequest, options?: TransportRequestOptions): Promise<T.GetTriggersBlocklistResponse> {
    return await this.transport.request<T.GetTriggersBlocklistResponse>({
      method: 'GET',
      path: '/api/ws/v1/automatic_query_refinement'
    }, options)
  }

  async putTriggersBlocklist (this: That, params?: T.PutTriggersBlocklistRequest, options?: TransportRequestOptions): Promise<T.PutTriggersBlocklistResponse> {
    const {
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.PutTriggersBlocklistResponse>({
      method: 'PUT',
      path: '/api/ws/v1/automatic_query_refinement',
      querystring
    }, options)
  }

  async getAutoQueryRefinementDetails (this: That, params: T.GetAutoQueryRefinementDetailsRequest, options?: TransportRequestOptions): Promise<T.GetAutoQueryRefinementDetailsResponse> {
    const {
      content_source_id,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.GetAutoQueryRefinementDetailsResponse>({
      method: 'GET',
      path: `/api/ws/v1/sources/${content_source_id}/automatic_query_refinement`,
      querystring
    }, options)
  }

  async getCurrentUser (this: That, params?: T.GetCurrentUserRequest, options?: TransportRequestOptions): Promise<T.GetCurrentUserResponse> {
    return await this.transport.request<T.GetCurrentUserResponse>({
      method: 'GET',
      path: '/api/ws/v1/whoami'
    }, options)
  }

  async createAnalyticsEvent (this: That, params: T.CreateAnalyticsEventRequest, options?: TransportRequestOptions): Promise<T.CreateAnalyticsEventResponse> {
    const {
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.CreateAnalyticsEventResponse>({
      method: 'POST',
      path: '/api/ws/v1/analytics/event',
      querystring,
      body: body
    }, options)
  }

  async search (this: That, params: T.SearchRequest, options?: TransportRequestOptions): Promise<T.SearchResponse> {
    const {
      body,
      ...querystring
    } = params ?? {}
    return await this.transport.request<T.SearchResponse>({
      method: 'POST',
      path: '/api/ws/v1/search',
      querystring,
      body: body
    }, options)
  }
}
