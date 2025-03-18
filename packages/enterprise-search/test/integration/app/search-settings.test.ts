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

import { test, teardown, beforeEach } from 'tap'
import { cleanup, createEngine, sleep } from '../helper'
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'
let engineName = ''

teardown(cleanup)

beforeEach(async () => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  engineName = await createEngine()
  await client.close()
})

test('returns engine search settings', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.getSearchSettings({ engine_name: engineName })
  t.type(response.search_fields, 'object')
  t.type(response.result_fields, 'object')
  t.type(response.boost, 'object')

  await client.close()
})

test('update search settings', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  // @ts-expect-error
  await client.app.putSchema({ engine_name: engineName, schema: { year: 'number' } })
  await client.app.indexDocuments({
    engine_name: engineName,
    documents: [
      { title: 'Attack of the Giant Leeches', year: 1959, director: 'Bernard L. Kowalski' },
      { title: '20,000 Leagues Under the Sea', year: 1916, director: 'Stuart Paton' },
      { title: 'Indestructible Man', year: 1956, director: 'Jack Pollexfen' },
      { title: 'Metropolis', year: 1927, director: 'Fritz Lang' }
    ]
  })
  await sleep(1000)

  const response = await client.app.putSearchSettings({
    engine_name: engineName,
    body: {
      boost: {
        year: [{
          type: 'proximity',
          function: 'linear',
          center: 1950,
          factor: 9
        }]
      }
    }
  })
  t.same(response.boost, {
    year: [{
      type: 'proximity',
      function: 'linear',
      center: 1950,
      factor: 9
    }]
  })

  await client.close()
})

test('resets search setting', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.resetSearchSettings({ engine_name: engineName })
  t.type(response.search_fields, 'object')
  t.type(response.result_fields, 'object')
  t.type(response.boost, 'object')

  await client.close()
})