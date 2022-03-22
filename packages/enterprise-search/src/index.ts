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

import {
  CloudConnectionPool,
  Diagnostic,
  UndiciConnection
} from '@elastic/transport'
import EnterpriseSearchClient from './EnterpriseSearchClient'
import AppSearchClient from './AppSearchClient'
import WorkplaceSearchClient from './WorkplaceSearchClient'
import { ClientOptions, InternalOptions, AuthOptions } from './utils'
import {
  kOptions,
  kConnectionPool,
  kEnterpriseSearch,
  kAppSearch,
  kWorkplaceSearch
} from './symbols'

export default class Client {
  [kOptions]: ClientOptions
  [kConnectionPool]: CloudConnectionPool
  [kEnterpriseSearch]: EnterpriseSearchClient | null
  [kAppSearch]: AppSearchClient | null
  [kWorkplaceSearch]: WorkplaceSearchClient | null
  diagnostic: Diagnostic

  constructor (opts: ClientOptions, internal?: InternalOptions) {
    this[kOptions] = opts
    this.diagnostic = internal?.diagnostic ?? new Diagnostic()

    if (internal?.connectionPool != null) {
      this[kConnectionPool] = internal.connectionPool
    } else {
      this[kConnectionPool] = new CloudConnectionPool({
        Connection: UndiciConnection,
        diagnostic: this.diagnostic,
        tls: opts.url.startsWith('https://')
          ? { secureProtocol: 'TLSv1_2_method' }
          : undefined
      })
      this[kConnectionPool].addConnection(opts.url)
    }

    this[kEnterpriseSearch] = null
    this[kAppSearch] = null
    this[kWorkplaceSearch] = null
  }

  get enterprise (): EnterpriseSearchClient {
    let client = this[kEnterpriseSearch]
    if (client === null) {
      client = new EnterpriseSearchClient(this[kOptions], {
        connectionPool: this[kConnectionPool],
        diagnostic: this.diagnostic
      })
    }
    return client
  }

  get app (): AppSearchClient {
    let client = this[kAppSearch]
    if (client === null) {
      client = new AppSearchClient(this[kOptions], {
        connectionPool: this[kConnectionPool],
        diagnostic: this.diagnostic
      })
    }
    return client
  }

  get workplace (): WorkplaceSearchClient {
    let client = this[kWorkplaceSearch]
    if (client === null) {
      client = new WorkplaceSearchClient(this[kOptions], {
        connectionPool: this[kConnectionPool],
        diagnostic: this.diagnostic
      })
    }
    return client
  }

  withAuth (opts: AuthOptions): Client {
    return new Client(
      { ...this[kOptions], ...opts },
      { diagnostic: this.diagnostic, connectionPool: this[kConnectionPool] }
    )
  }

  async close (): Promise<void> {
    return await this[kConnectionPool].empty()
  }
}
