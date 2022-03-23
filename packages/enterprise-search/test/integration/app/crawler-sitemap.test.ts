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

test('creates, updates and deletes a crawler sitemap configuration', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const sitemap = await client.app.createCrawlerSitemap({
    engine_name: engineName,
    domain_id: domain.id!,
    body: {
      url: 'https://www.elastic.co/sitemap.xml'
    }
  })

  t.type(sitemap.id, 'string')
  t.type(sitemap.created_at, 'string')
  t.equal(sitemap.url, 'https://www.elastic.co/sitemap.xml')

  const response1 = await client.app.putCrawlerSitemap({
    engine_name: engineName,
    domain_id: domain.id!,
    sitemap_id: sitemap.id!,
    body: {
      url: 'https://www.elastic.co/sitemap2.xml'
    }
  })

  t.type(response1.id, 'string')
  t.type(response1.created_at, 'string')
  t.equal(response1.url, 'https://www.elastic.co/sitemap2.xml')

  const response2 = await client.app.deleteCrawlerSitemap({
    engine_name: engineName,
    domain_id: domain.id!,
    sitemap_id: sitemap.id!
  })

  t.ok(response2.deleted)

  await client.close()
})