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

import { test, teardown } from 'tap'
import { createEngine, cleanup, genName, sleep } from '../helper'
import { Client } from '../../..'

const DAY = 1000 * 60 * 60 * 24
const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'

teardown(cleanup)

test('createApiKey', async t => {
  const engineName = await createEngine()
  const client = new Client({ url, auth: { username, password } })

  {
    const apiKey = await client.app.createApiKey({
      body: {
        name: genName(),
        type: 'private',
        read: true,
        write: true,
        access_all_engines: true
      }
    })
  
    // @ts-expect-error `.key` exists
    const privateClient = new Client({ url, auth: { token: apiKey.key }})
    const response = await privateClient.app.indexDocuments({
      engine_name: engineName,
      documents: [{ title: 'test docuemnt' }]
    })
    await privateClient.app.deleteDocuments({
      engine_name: engineName,
      documentIds: [response[0].id]
    })
  }

  let response = await client.app.getApiLogs({
    engine_name: engineName,
    body: {
      filters: {
        date: {
          from: new Date(Date.now() - DAY).toISOString(),
          to: new Date(Date.now() + DAY).toISOString()
        }
      }
    }
  })
  let attempts = 0
  // @ts-expect-error
  while (response.results?.length < 1 && attempts < 20) {
    await sleep(1000)
    attempts += 1
    response = await client.app.getApiLogs({
      engine_name: engineName,
      body: {
        filters: {
          date: {
            from: new Date(Date.now() - DAY).toISOString(),
            to: new Date(Date.now() + DAY).toISOString()
          }
        }
      }
    })
  }
  // @ts-expect-error
  t.ok(response.results?.length >= 1)
})