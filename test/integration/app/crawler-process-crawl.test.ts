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
  await client.app.createCrawlerDomain({
    engine_name: engineName,
    body: {
      name: 'https://www.elastic.co'
    }
  })

  await client.close()
})

test('creates, retrieves and shows denied for a process crawl', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const crawl = await client.app.createCrawlerProcessCrawl({
    engine_name: engineName,
    body: {
      dry_run: true
    }
  })

  t.same(crawl.domains, ['https://www.elastic.co'])

  const response = await client.app.getCrawlerProcessCrawl({
    engine_name: engineName,
    process_crawl_id: crawl.id!
  })
  t.type(response.total_url_count, 'number')
  t.type(response.denied_url_count, 'number')

  await client.close()
})

test('lists process crawl', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.app.createCrawlerProcessCrawl({
    engine_name: engineName,
    body: { dry_run: true }
  })
  await client.app.createCrawlerProcessCrawl({
    engine_name: engineName,
    body: { dry_run: true }
  })


  const response = await client.app.listCrawlerProcessCrawls({
    engine_name: engineName
  })
  t.equal(response.results.length, 2)

  await client.close()
})