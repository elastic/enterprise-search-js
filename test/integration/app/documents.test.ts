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
let documentIds: string[]

teardown(cleanup)

beforeEach(async () => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  engineName = await createEngine()
  const response = await client.app.indexDocuments({
    engine_name: engineName,
    documents:       [
      { name: 'Super Lorenzo Bros', year: '1985' },
      { name: 'Pack-Man', year: '1980' },
      { name: 'Galaxxian', year: '1979' },
      { name: 'Audiovisual, the hedgehog', year: '1991' }
    ]
  })
  documentIds = response.map(doc => doc.id)
  let list = await client.app.listDocuments({ engine_name: engineName })
  let attempts = 0
  while (list.results.length < 1 && attempts < 20) {
    await sleep(500)
    attempts += 1
    list = await client.app.listDocuments({ engine_name: engineName })
  }
  await client.close()
})

test('indexes and lists documents', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.listDocuments({ engine_name: engineName })
  t.equal(response.results.length, 4)

  await client.close()
})

test('retrieves documents by ID', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.getDocuments({
    engine_name: engineName,
    documentIds
  })
  t.equal(response.length, 4)

  await client.close()
})

test('searches for a document', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.search({
    engine_name: engineName,
    body: {
      query: 'Pack-Man'
    }
  })
  // @ts-expect-error
  t.equal(response.results[0].name.raw, 'Pack-Man')
  // @ts-expect-error
  t.equal(response.results[0].year.raw, '1980')

  await client.close()
})

test('deletes a document', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.deleteDocuments({
    engine_name: engineName,
    documentIds: [documentIds[0]]
  })
  t.same(response, [{
    id: documentIds[0],
    deleted: true
  }])

  await client.close()
})

test('updates a document', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response1 = await client.app.putDocuments({
    engine_name: engineName,
    documents: [{ id: documentIds[0], year: '9999' }]
  })
  t.same(response1, [{
    id: documentIds[0],
    errors: []
  }])

  const response2 = await client.app.getDocuments({
    engine_name: engineName,
    documentIds: [documentIds[0]]
  })
  t.equal(response2[0]?.year, '9999')

  await client.close()
})