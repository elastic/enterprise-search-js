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
import { Client, AppTypes } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'
let engineName = ''
let domain: AppTypes.GetCrawlerDomainResponse

teardown(cleanup)

beforeEach(async () => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  engineName = await createEngine()
  domain = await client.app.createCrawlerDomain({
    engine_name: engineName,
    body: {
      name: 'https://www.elastic.co'
    }
  })

  await client.close()
})

test('creates an entry point', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.app.createCrawlerEntryPoint({
    engine_name: engineName,
    domain_id: domain.id!,
    body: {
      value: '/enterprise-search'
    }
  })

  t.type(response.id, 'string')
  t.type(response.created_at, 'string')
  t.equal(response.value, '/enterprise-search')

  await client.close()
})

test('updates an entry point', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const entryPoint = await client.app.createCrawlerEntryPoint({
    engine_name: engineName,
    domain_id: domain.id!,
    body: {
      value: '/enterprise-search'
    }
  })

  const response = await client.app.putCrawlerEntryPoint({
    engine_name: engineName,
    domain_id: domain.id!,
    entry_point_id: entryPoint.id!,
    body: {
      value: '/elastic-stack'
    }
  })

  t.type(response.id, 'string')
  t.type(response.created_at, 'string')
  t.not(response.value, entryPoint.value)

  await client.close()
})

test('deletes an entry point', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const entryPoint = await client.app.createCrawlerEntryPoint({
    engine_name: engineName,
    domain_id: domain.id!,
    body: {
      value: '/enterprise-search'
    }
  })

  const response = await client.app.deleteCrawlerEntryPoint({
    engine_name: engineName,
    domain_id: domain.id!,
    entry_point_id: entryPoint.id!
  })

  t.ok(response.deleted)

  await client.close()
})