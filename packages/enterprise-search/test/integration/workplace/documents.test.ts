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
import { cleanup, createContentSource, sleep } from '../helper'
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'
let contentSourceId = ''
const documents = [{
  id: '4e696e74656e646f203634',
  url: 'https://www.elastic.co/blog/introducing-quick-start-guides-getting-started-with-elastic-enterprise-search-for-free',
  title: 'Getting started with Elastic Enterprise Search for free',
  body: 'this is a test'
}, {
  id: '47616d6520426f7920436f6c6f72',
  url: 'https://www.elastic.co/workplace-search',
  title: 'One-stop answer shop for the virtual workplace',
  body: 'this is also a test'
}]

teardown(cleanup)

beforeEach(async () => {
  contentSourceId = await createContentSource()
})

test('indexes', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.workplace.indexDocuments({
    content_source_id: contentSourceId,
    documents
  })
  t.equal(response.results.length, 2)

  await client.close()
})

test('deletes', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.workplace.indexDocuments({
    content_source_id: contentSourceId,
    documents
  })
  
  await sleep(1000)

  const response = await client.workplace.deleteDocuments({
    content_source_id: contentSourceId,
    document_ids: documents.map(doc => doc.id)
  })
  t.equal(response.results.length, 2)

  await client.close()
})

test('Gets a document in a content source', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.workplace.indexDocuments({
    content_source_id: contentSourceId,
    documents
  })
  
  await sleep(1000)

  const response = await client.workplace.getDocument({
    content_source_id: contentSourceId,
    document_id: documents[0].id
  })
  t.type(response.updated_at, 'string')
  t.type(response.last_updated, 'string')
  t.equal(response.content_source_id, contentSourceId)
  t.match(response, documents[0])

  await client.close()
})

test('Deletes documents by query', { skip: 'bad definition?' }, async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.workplace.indexDocuments({
    content_source_id: contentSourceId,
    documents
  })
  
  await sleep(1000)

  const response = await client.workplace.deleteDocumentsByQuery({
    content_source_id: contentSourceId,
    body: {
      // @ts-expect-error
      query: 'answer'
    }
  })
  t.equal(response.deleted, 1)
  t.same(response.failures, {})
  t.equal(response.total, 1)

  await client.close()
})
