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
  await client.app.indexDocuments({
    engine_name: engineName,
    documents: [{ title: 'test', director: 'someone' }]
  })
  await sleep(1000)
  await client.close()
})

test('returns an engine schema', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.getSchema({ engine_name: engineName })
  t.same(response, {
    title: 'text',
    director: 'text'
  })

  await client.close()
})

test('updates a schema for an engine', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const schema = await client.app.putSchema({
    engine_name: engineName,
    // @ts-expect-error
    schema: { year: 'number' }
  })
  t.same(schema, {
    title: 'text',
    director: 'text',
    year: 'number'
  })

  const response = await client.app.getSchema({ engine_name: engineName })
  t.same(response, {
    title: 'text',
    director: 'text',
    year: 'number'
  })

  await client.close()
})