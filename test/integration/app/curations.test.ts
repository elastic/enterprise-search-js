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
import { cleanup, createEngine, createCuration, sleep } from '../helper'
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'
let engineName = ''
let promoted: { id: string }
let hidden: { id: string }

teardown(cleanup)

beforeEach(async () => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  engineName = await createEngine()
  const response = await client.app.indexDocuments({
    engine_name: engineName,
    documents: [{
      title: 'Jungle Tales', author: 'Horacio Quiroga'
    }, {
      title: 'The Jungle Book', author: 'Rudyard Kipling'
    }]
  })
  promoted = response[0]
  hidden = response[1]

  await client.close()
})

test('creates a new curation', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const curation = await client.app.createCuration({
    engine_name: engineName,
    body: {
      queries: ['jungle'],
      promoted: [promoted.id],
      hidden: [hidden.id]
    }
  })
  await sleep(500)
  t.ok(/cur-[0-9a-f]+/.test(curation.id))

  const response = await client.app.search({
    engine_name: engineName,
    body: {
      query: 'jungle'
    }
  })
  t.equal(response.results.length, 1)
  // @ts-expect-error
  t.equal(response.results[0].title.raw, 'Jungle Tales')

  await client.close()
})

test('retrieves a curation by id', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const id = await createCuration(engineName, ['book'], [promoted.id], [hidden.id])

  const response = await client.app.getCuration({
    engine_name: engineName,
    curation_id: id
  })
  t.ok(/cur-[0-9a-f]+/.test(response.id!))
  t.same(response.queries, ['book'])
  t.same(response.promoted, [promoted.id])
  t.same(response.hidden, [hidden.id])

  await client.close()
})

test('updates an existing curation', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const id = await createCuration(engineName, ['jungle'], [promoted.id], [hidden.id])

  await client.app.putCuration({
    engine_name: engineName,
    curation_id: id,
    body: {
      queries: ['jungle'],
      promoted: [hidden.id],
      hidden: [promoted.id]
    }
  })

  const response = await client.app.search({
    engine_name: engineName,
    body: {
      query: 'jungle'
    }
  })
  t.equal(response.results.length, 1)
  // @ts-expect-error
  t.equal(response.results[0].title.raw, 'The Jungle Book')

  await client.close()
})

test('lists curations', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const curations = [
    await createCuration(engineName, ['jungle'], [promoted.id], [hidden.id]),
    await createCuration(engineName, ['book'], [promoted.id], [hidden.id]),
    await createCuration(engineName, ['tales'], [promoted.id], [hidden.id])
  ]

  const response = await client.app.listCurations({ engine_name: engineName })
  t.equal(response.results.length, 3)
  for (const result of response.results) {
    t.ok(curations.includes(result.id!))
  }

  await client.close()
})

test('deletes a curation', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const id = await createCuration(engineName, ['jungle'], [promoted.id], [hidden.id])

  const response = await client.app.deleteCuration({
    engine_name: engineName,
    curation_id: id
  })
  t.ok(response.deleted)

  await client.close()
})