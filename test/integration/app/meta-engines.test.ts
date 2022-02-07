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
import { cleanup, createEngine, genName } from '../helper'
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'
let engineNames: string[] = []
let metaEngineName = ''

teardown(cleanup)

beforeEach(async () => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  engineNames = [
    await createEngine(),
    await createEngine()
  ].sort()
  metaEngineName = genName()
  await client.app.createEngine({
    body: {
      name: metaEngineName,
      type: 'meta',
      source_engines: engineNames
    }
  })
  await client.close()
})

test('creates a meta engine', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.getEngine({ engine_name: metaEngineName })
  t.equal(response.name, metaEngineName)
  t.equal(response.type, 'meta')
  t.same(response.source_engines?.sort(), engineNames)

  await client.close()
})

test('adds a new source engine to a meta engine', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const engineName = await createEngine()
  const response = await client.app.addMetaEngineSource({
    engine_name: metaEngineName,
    sourceEngines: [engineName]
  })
  t.same(response.source_engines?.sort(), engineNames.concat(engineName).sort())

  await client.close()
})

test('removes a source engine from a meta engine', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.deleteMetaEngineSource({
    engine_name: metaEngineName,
    sourceEngines: [engineNames[0]]
  })
  t.same(response.source_engines, [engineNames[1]])

  await client.close()
})