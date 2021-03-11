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

import { test } from 'tap'
import Client from '../../'
import { kOptions } from '../../lib/symbols'

test('Override authentication', t => {
  t.plan(3)

  const initial = {
    enterprise: {
      auth: {
        username: 'foo',
        password: 'bar'
      }
    },
    app: {
      auth: {
        token: 'hello'
      }
    },
    workplace: {
      auth: {
        token: 'hello'
      }
    }
  }

  const updated = {
    enterprise: {
      auth: {
        username: 'faz',
        password: 'baz'
      }
    },
    app: {
      auth: {
        token: 'world'
      }
    },
    workplace: {
      auth: {
        token: 'world'
      }
    }
  }

  const client = new Client({
    url: 'http://localhost:8080',
    ...initial
  })

  t.deepEqual(client[kOptions], {
    url: 'http://localhost:8080',
    ...initial
  })

  const child = client.withAuth(updated)

  t.deepEqual(child[kOptions], {
    url: 'http://localhost:8080',
    ...updated
  })

  t.notDeep(child[kOptions], {
    url: 'http://localhost:8080',
    ...initial
  })
})
