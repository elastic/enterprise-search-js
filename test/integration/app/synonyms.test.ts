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
import { cleanup, createEngine } from '../helper'
import { Client, errors } from '../../..'

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

test('creates a synonym set', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.createSynonymSet({
    engine_name: engineName,
    body: {
      synonyms: ['joypad', 'gamepad']
    }
  })
  t.same(response.synonyms, ['joypad', 'gamepad'])
  t.type(response.id, 'string')

  await client.close()
})

test('lists a synonym set', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.app.createSynonymSet({
    engine_name: engineName,
    body: {
      synonyms: ['joypad', 'gamepad']
    }
  })

  const response = await client.app.listSynonymSets({ engine_name: engineName })
  t.ok(response.results.length > 0)
  t.same(response.results[0].synonyms, ['joypad', 'gamepad'])

  await client.close()
})

test('retrieves a synonym set by ID', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const synonym = await client.app.createSynonymSet({
    engine_name: engineName,
    body: {
      synonyms: ['joypad', 'gamepad']
    }
  })

  const response = await client.app.getSynonymSet({
    engine_name: engineName,
    synonym_set_id: synonym.id!
  })
  t.same(response.synonyms, ['joypad', 'gamepad'])

  await client.close()
})

test('updates a synonym set', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const synonym = await client.app.createSynonymSet({
    engine_name: engineName,
    body: {
      synonyms: ['joypad', 'gamepad']
    }
  })

  const response1 = await client.app.putSynonymSet({
    engine_name: engineName,
    synonym_set_id: synonym.id!,
    body: {
      synonyms: ['gamepad', 'controller']
    }
  })
  t.same(response1.synonyms, ['gamepad', 'controller'])

  const response2 = await client.app.getSynonymSet({
    engine_name: engineName,
    synonym_set_id: synonym.id!
  })
  t.same(response2.synonyms, ['gamepad', 'controller'])

  await client.close()
})

test('deletes a synonym set', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const synonym = await client.app.createSynonymSet({
    engine_name: engineName,
    body: {
      synonyms: ['joypad', 'gamepad']
    }
  })

  const response1 = await client.app.deleteSynonymSet({
    engine_name: engineName,
    synonym_set_id: synonym.id!
  })
  t.ok(response1.deleted)

  try {
    await client.app.getSynonymSet({
      engine_name: engineName,
      synonym_set_id: synonym.id!
    })
  } catch (err: any) {
    t.ok(err instanceof errors.ResponseError)
    t.equal(err.statusCode, 404)
  }

  await client.close()
})