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

import { test, beforeEach, teardown } from 'tap'
import { cleanup, createContentSource } from '../helper'
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'
let contentSourceId = ''

teardown(cleanup)

beforeEach(async () => {
  contentSourceId = await createContentSource()
})

test('creates an external identity', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.workplace.createExternalIdentity({
    content_source_id: contentSourceId,
    body: {
      external_user_id: 'elastic_user',
      external_user_properties: [{
        attribute_name: '_elasticsearch_username',
        attribute_value: 'elastic_user'
      }],
      permissions: []
    }
  })
  t.same(response, {
    content_source_id: contentSourceId,
    external_user_id: 'elastic_user',
    external_user_properties: [{
      attribute_name: '_elasticsearch_username',
      attribute_value: 'elastic_user'
    }],
    permissions: []
  })

  await client.close()
})

test('creates and retrieves', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.workplace.createExternalIdentity({
    content_source_id: contentSourceId,
    body: {
      external_user_id: 'elastic_user',
      external_user_properties: [{
        attribute_name: '_elasticsearch_username',
        attribute_value: 'elastic_user'
      }],
      permissions: []
    }
  })

  const response = await client.workplace.getExternalIdentity({
    content_source_id: contentSourceId,
    external_user_id: 'elastic_user'
  })
  t.same(response, {
    content_source_id: contentSourceId,
    external_user_id: 'elastic_user',
    external_user_properties: [{
      attribute_name: '_elasticsearch_username',
      attribute_value: 'elastic_user'
    }],
    permissions: []
  })

  await client.close()
})

test('creates and deletes', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.workplace.createExternalIdentity({
    content_source_id: contentSourceId,
    body: {
      external_user_id: 'elastic_user',
      external_user_properties: [{
        attribute_name: '_elasticsearch_username',
        attribute_value: 'elastic_user'
      }],
      permissions: []
    }
  })

  const response = await client.workplace.deleteExternalIdentity({
    content_source_id: contentSourceId,
    external_user_id: 'elastic_user'
  })
  t.equal(response, 'ok')

  await client.close()
})

test('list', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.workplace.createExternalIdentity({
    content_source_id: contentSourceId,
    body: {
      external_user_id: 'elastic_user',
      external_user_properties: [{
        attribute_name: '_elasticsearch_username',
        attribute_value: 'elastic_user'
      }],
      permissions: []
    }
  })

  const response = await client.workplace.listExternalIdentities({
    content_source_id: contentSourceId
  })
  t.equal(response.results.length, 1)

  await client.close()
})

test('creates and updates', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.workplace.createExternalIdentity({
    content_source_id: contentSourceId,
    body: {
      external_user_id: 'elastic_user',
      external_user_properties: [{
        attribute_name: '_elasticsearch_username',
        attribute_value: 'elastic_user'
      }],
      permissions: []
    }
  })

  const response = await client.workplace.putExternalIdentity({
    content_source_id: contentSourceId,
    external_user_id: 'elastic_user',
    body: {
      external_user_id: 'elastic_user',
      external_user_properties: [{
        attribute_name: '_elasticsearch_username',
        attribute_value: 'elastic_user'
      }],
      permissions: ['foo']
    }
  })
  t.same(response.permissions, ['foo'])

  await client.close()
})
