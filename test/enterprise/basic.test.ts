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
import Client from '../..'
import { getServiceUrl, getEntCredentials } from '../helper'

const url = getServiceUrl()
const { username, password } = getEntCredentials()

test('Basic', async t => {
  const client = new Client({
    url,
    enterprise: {
      auth: { username, password }
    }
  })

  const response = await client.enterprise.getVersion()
  t.type(response.number, 'string')
  t.type(response.build_date, 'string')
  t.type(response.build_hash, 'string')

  await client.close()
})

test('Basic with meta', async t => {
  const client = new Client({
    url,
    enterprise: {
      auth: { username, password }
    }
  })

  const response = await client.enterprise.getVersion(null, { meta: true })
  t.strictEqual(response.statusCode, 200)
  t.type(response.body.number, 'string')
  t.type(response.body.build_date, 'string')
  t.type(response.body.build_hash, 'string')

  await client.close()
})
