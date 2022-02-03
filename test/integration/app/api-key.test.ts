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

import { test, beforeEach } from 'tap'
import { customAlphabet } from 'nanoid'
import { Client, errors } from '../../..'

const genName = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)
const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'

beforeEach(async () => {
  const client = new Client({
    url,
    auth: { username, password }
  })
  const response = await client.app.listApiKeys({ page_size: 100 })
  for (const key of response.results) {
    await client.app.deleteApiKey({ api_key_name: key.name })
  }
  await client.close()
})

test('createApiKey', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const name = genName()

  const response = await client.app.createApiKey({
    body: {
      name,
      type: 'private',
      read: true,
      write: true,
      access_all_engines: true
    }
  })

  t.match(response, {
    name,
    type: 'private',
    read: true,
    write: true,
    access_all_engines: true
  })

  await client.close()
})

test('getApiKey', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const name = genName()

  await client.app.createApiKey({
    body: {
      name,
      type: 'private',
      read: true,
      write: true,
      access_all_engines: true
    }
  })

  const response = await client.app.getApiKey({ api_key_name: name })

  t.match(response, {
    name,
    type: 'private',
    read: true,
    write: true,
    access_all_engines: true
  })

  await client.close()
})

test('deleteApiKey', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const name = genName()

  await client.app.createApiKey({
    body: {
      name,
      type: 'private',
      read: true,
      write: true,
      access_all_engines: true
    }
  })

  const response = await client.app.deleteApiKey({ api_key_name: name })

  t.ok(response.deleted)

  try {
    await client.app.getApiKey({ api_key_name: name })
  } catch (err: any) {
    t.ok(err instanceof errors.ResponseError)
    t.equal(err.statusCode, 404)
  }

  await client.close()
})

test('putApiKey', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const name = genName()

  await client.app.createApiKey({
    body: {
      name,
      type: 'private',
      read: true,
      write: true,
      access_all_engines: true
    }
  })

  const response1 = await client.app.getApiKey({ api_key_name: name })

  t.match(response1, {
    name,
    type: 'private',
    read: true,
    write: true,
    access_all_engines: true
  })

  const response2 = await client.app.putApiKey({
    api_key_name: name,
    body: {
      name,
      type: 'private',
      read: true,
      write: false,
      access_all_engines: true
    }
  })

  t.match(response2, {
    name,
    type: 'private',
    read: true,
    write: false,
    access_all_engines: true
  })

  const response3 = await client.app.getApiKey({ api_key_name: name })

  t.match(response3, {
    name,
    type: 'private',
    read: true,
    write: false,
    access_all_engines: true
  })

  await client.close()
})

test('listApiKeys', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const keys = [genName(), genName(), genName(), genName(), genName()].map(key => {
    return {
      name: key,
      type: 'private',
      read: true,
      write: true,
      access_all_engines: true
    }
  })

  for (const key of keys) {
    await client.app.createApiKey({
      // @ts-expect-error
      body: key
    })
  }

  const response = await client.app.listApiKeys()

  t.match(response, {
    meta: {
      page: {
        current: 1,
        total_pages: 1,
        total_results: 5,
        size: 25
      }
    }
  })
  t.equal(response.results.length, 5)

  await client.close()
})