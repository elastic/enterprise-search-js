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
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'

test('getHealth', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.enterprise.getHealth()
  t.type(response.name, 'string')
  t.type(response.cluster_uuid, 'string')

  await client.close()
})

test('getReadOnly', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.enterprise.getReadOnly()
  t.type(response.enabled, 'boolean')

  await client.close()
})

test('putReadOnly true', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  let response = await client.enterprise.putReadOnly({
    body: { enabled: true }
  })
  t.equal(response.enabled, true)

  response = await client.enterprise.getReadOnly()
  t.equal(response.enabled, true)

  await client.close()
})

test('putReadOnly false', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  let response = await client.enterprise.putReadOnly({
    body: { enabled: false }
  })
  t.equal(response.enabled, false)

  response = await client.enterprise.getReadOnly()
  t.equal(response.enabled, false)

  await client.close()
})

test('getStats', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.enterprise.getStats()
  t.type(response.cluster_uuid, 'string')
  t.type(response.app.pid, 'number')
  t.type(response.connectors.alive, 'boolean')

  await client.close()
})

test('getVersion', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.enterprise.getVersion()
  t.type(response.number, 'string')
  t.type(response.build_hash, 'string')
  t.type(response.build_date, 'string')

  await client.close()
})