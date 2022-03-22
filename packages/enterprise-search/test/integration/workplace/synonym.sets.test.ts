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

import { test, teardown, afterEach } from 'tap'
import { cleanup } from '../helper'
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'

teardown(cleanup)

afterEach(async () => {
  const client = new Client({
    url,
    auth: { username, password }
  })
  const synonyms = await client.workplace.listSynonymSets()
  for (const synonym of synonyms.results ?? []) {
    await client.workplace.deleteSynonymSet({ synonym_set_id: synonym.id! })
  }
  await client.close()
})

test('creates a batch synonym set', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.workplace.createBatchSynonymSets({
    body: {
      synonym_sets: [
        { synonyms: ['house', 'home', 'abode'] },
        { synonyms: ['cat', 'feline', 'kitty'] },
        { synonyms: ['mouses', 'mice'] }
      ]
    }
  })
  t.equal(response.synonym_sets?.length, 3)
  t.notOk(response.has_errors)

  await client.close()
})

test('lists a synonym set', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  await client.workplace.createBatchSynonymSets({
    body: {
      synonym_sets: [
        { synonyms: ['house', 'home', 'abode'] },
        { synonyms: ['cat', 'feline', 'kitty'] },
        { synonyms: ['mouses', 'mice'] }
      ]
    }
  })

  const response = await client.workplace.listSynonymSets()
  t.equal(response.results?.length, 3)

  await client.close()
})

test('get a single synonym set', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response = await client.workplace.createBatchSynonymSets({
    body: {
      synonym_sets: [
        { synonyms: ['house', 'home', 'abode'] },
        { synonyms: ['cat', 'feline', 'kitty'] },
        { synonyms: ['mouses', 'mice'] }
      ]
    }
  })

  // @ts-expect-error
  const synomym = await client.workplace.getSynonymSet({ synonym_set_id: response.synonym_sets[0].id! })
  t.same(synomym.synonyms, ['house', 'home', 'abode'])

  await client.close()
})

test('updates a single synonym set', async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const response1 = await client.workplace.createBatchSynonymSets({
    body: {
      synonym_sets: [
        { synonyms: ['house', 'home', 'abode'] }
      ]
    }
  })

  const response2 = await client.workplace.putSynonymSet({
    // @ts-expect-error
    synonym_set_id: response1.synonym_sets[0].id!,
    body: {
      synonyms: ['mouses', 'mice', 'luch']
    }
  })
  // @ts-expect-error
  t.equal(response2.id, response1.synonym_sets[0].id!)

  // @ts-expect-error
  const synomym = await client.workplace.getSynonymSet({ synonym_set_id: response1.synonym_sets[0].id! })
  t.same(synomym.synonyms, ['mouses', 'mice', 'luch'])

  await client.close()
})
