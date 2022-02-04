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

import { test, teardown } from 'tap'
import { cleanup, genName } from '../helper'
import { Client } from '../../..'

const url = process.env.ENTERPRISE_SEARCH_URL ?? 'http://localhost:3002'
const username = process.env.ELASTIC_ENTERPRISE_USER ?? 'elastic'
const password = process.env.ELASTIC_ENTERPRISE_PASSWORD ?? 'changeme'

teardown(cleanup)

test('creates a batch synonym set', { skip: 'the definiton is not correct' }, async t => {
  const client = new Client({
    url,
    auth: { username, password }
  })

  const newBlock = genName()
  const initial = await client.workplace.getTriggersBlocklist()
  t.type(initial.blocklist, 'object')

  const response = await client.workplace.putTriggersBlocklist({
    body: initial.blocklist.concat(newBlock)
  })
  t.same(response.blocklist, initial.blocklist.concat(newBlock))

  await client.workplace.putTriggersBlocklist({
    body: initial.blocklist
  })

  await client.close()
})
