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

import { test, teardown, afterEach } from 'tap'
import { cleanup, genName, createEngine, deleteEngines } from '../helper'
import { Client, errors } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'

teardown(cleanup)

afterEach(async () => {
  await deleteEngines()
})

test('creates a new engine', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const engineName = genName()
  const response = await client.app.createEngine({
    body: {
      name: engineName
    }
  })
  t.same(response, {
    name: engineName,
    type: 'default',
    language: null,
    index_create_settings_override: {},
    document_count: 0
  })

  await client.close()
})

test('lists engines', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const engines = [
    await createEngine(),
    await createEngine()
  ]

  const response = await client.app.listEngines()
  t.equal(response.results.length, 2)
  t.ok(engines.includes(response.results[0].name))
  t.ok(engines.includes(response.results[1].name))

  await client.close()
})

test('retrieves an engine by name', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const engineName = await createEngine()

  const response = await client.app.getEngine({ engine_name: engineName })
  t.same(response, {
    name: engineName,
    type: 'default',
    language: null,
    index_create_settings_override: {},
    document_count: 0
  })

  await client.close()
})

test('deletes an engine', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const engineName = await createEngine()

  const response = await client.app.deleteEngine({ engine_name: engineName })
  t.ok(response.deleted)

  try {
    await client.app.getEngine({ engine_name: engineName })
  } catch (err: any) {
    t.ok(err instanceof errors.ResponseError)
    t.equal(err.statusCode, 404)
  }

  await client.close()
})