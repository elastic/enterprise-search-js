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

import { Transport } from '@elastic/transport'
import Serializer from './Serializer'
import API from './api/enterprise/api'
import { BasicAuth, BearerAuth, InternalOptions } from './types'

export * as EnterpriseTypes from './api/enterprise/types'

export interface EnterpriseSearchClientOptions {
  url: string
  auth: BasicAuth | BearerAuth
}

export default class EnterpriseSearchClient extends API {
  transport: Transport
  constructor (opts: EnterpriseSearchClientOptions, internal: InternalOptions) {
    super()
    const authorization = isBearerAuth(opts.auth)
      ? `Bearer ${opts.auth.token}`
      : 'Basic ' + Buffer.from(`${opts.auth.username}:${opts.auth.password}`).toString('base64')
    this.transport = new Transport({
      serializer: new Serializer(),
      connectionPool: internal.connectionPool,
      diagnostic: internal.diagnostic,
      compression: true,
      name: 'enterprise-search',
      headers: { authorization }
    })
  }
}

function isBearerAuth (obj: any): obj is BearerAuth {
  return obj.token != null
}
