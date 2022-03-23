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

import { readFile } from 'fs/promises'
import { join } from 'path'
import { test, beforeEach, teardown } from 'tap'
import { cleanup, createContentSource, genName } from '../helper'
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'
let contentSourceId = ''

teardown(cleanup)

beforeEach(async () => {
  contentSourceId = await createContentSource()
})

test('creates, retrieves and deletes authenticated with basic auth', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const contentSource = await client.workplace.getContentSource({ content_source_id: contentSourceId })
  t.type(contentSource.name, 'string')

  const response1 = await client.workplace.listContentSources()
  t.equal(response1.results.length, 1)

  const response2 = await client.workplace.deleteContentSource({ content_source_id: contentSourceId })
  t.ok(response2.deleted)

  const response3 = await client.workplace.listContentSources()
  t.equal(response3.results.length, 0)

  await client.close()
})

test('creates and updates', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const newName = genName()
  const contentSource = await client.workplace.getContentSource({ content_source_id: contentSourceId })

  const response1 = await client.workplace.putContentSource({
    content_source_id: contentSource.id,
    body: {
      name: newName,
      schema: { title: 'text', body: 'text', url: 'text' },
      display: { title_field: 'title', url_field: 'url', color: '#f00f00' },
      is_searchable: true
    }
  })
  t.equal(response1.name, newName)

  const response2 = await client.workplace.getContentSource({ content_source_id: contentSource.id })
  t.not(contentSource.name, response2.name)
  t.equal(response2.name, newName)

  await client.close()
})

test('syncs jobs', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.workplace.commandSyncJobs({
    content_source_id: contentSourceId,
    body: { command: 'interrupt' }
  })
  t.same(Object.keys(response.results), ['interrupted'])

  await client.close()
})

test('puts an icon', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const icon = await readFile(
    join(__dirname, '..', '..', 'fixtures', 'icon.png'),
    { encoding: 'base64' }
  )
  const response = await client.workplace.putContentSourceIcons({
    content_source_id: contentSourceId,
    body: {
      main_icon: icon,
      alt_icon: icon
    }
  })
  t.same(response.results, {
    main_icon: 'success',
    alt_icon: 'success'
  })

  await client.close()
})

test('auto query refinements details', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.workplace.getAutoQueryRefinementDetails({ content_source_id: contentSourceId })
  t.type(response.results, 'object')
  t.type(response.overrides, 'object')
  t.type(response.defaults, 'object')

  await client.close()
})
